import User from '../../models/User.model.js';
import { generateToken } from '../../utils/jwt.js';
import { GraphQLError } from 'graphql';

const validateEmail = (email) => {
    if (!email.toLowerCase().endsWith('@ldce.ac.in')) {
        throw new GraphQLError('Email must be an @ldce.ac.in address', {
            extensions: { code: 'INVALID_EMAIL_DOMAIN' }
        });
    }
};

export const loginUser = async (identifier, password) => {
    let query = {};
    if (identifier.includes('@')) {
        validateEmail(identifier);
        query = { email: identifier.toLowerCase() };
    } else {
        query = { enrollmentNo: identifier };
    }

    const user = await User.findOne(query);
    if (!user) {
        throw new GraphQLError('User not found', {
            extensions: { code: 'USER_NOT_FOUND' }
        });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new GraphQLError('Invalid credentials', {
            extensions: { code: 'INVALID_CREDENTIALS' }
        });
    }

    const token = generateToken({
        id: user._id,
        userId: user._id,
        role: user.role
    });

    return { token, user };
};

export const registerStudent = async (input) => {
    const { email, enrollmentNo, password, name, department, semester } = input;

    validateEmail(email);

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
        throw new GraphQLError('Email already registered', {
            extensions: { code: 'EMAIL_ALREADY_EXISTS' }
        });
    }

    const existingEnroll = await User.findOne({ enrollmentNo });
    if (existingEnroll) {
        throw new GraphQLError('Enrollment number already exists', {
            extensions: { code: 'ENROLLMENT_ALREADY_EXISTS' }
        });
    }

    const user = await User.create({
        name,
        email: email.toLowerCase(),
        enrollmentNo,
        password,
        department,
        semester,
        role: 'STUDENT'
    });

    const token = generateToken({ id: user._id, userId: user._id, role: user.role });
    return { token, user };
};

export const registerFaculty = async (input) => {
    const { email, facultyId, password, name, department, designation } = input;

    validateEmail(email);

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
        throw new GraphQLError('Email already registered', {
            extensions: { code: 'EMAIL_ALREADY_EXISTS' }
        });
    }

    const existingFaculty = await User.findOne({ facultyId });
    if (existingFaculty) {
        throw new GraphQLError('Faculty ID already exists', {
            extensions: { code: 'FACULTY_ID_ALREADY_EXISTS' }
        });
    }

    const user = await User.create({
        name,
        email: email.toLowerCase(),
        facultyId,
        password,
        department,
        designation,
        role: 'FACULTY'
    });

    const token = generateToken({ id: user._id, userId: user._id, role: user.role });
    return { token, user };
};

export const getCurrentUser = async (userId) => {
    if (!userId) {
        throw new GraphQLError('Unauthorized', {
            extensions: { code: 'UNAUTHORIZED' }
        });
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new GraphQLError('User not found', {
            extensions: { code: 'USER_NOT_FOUND' }
        });
    }
    return user;
};
