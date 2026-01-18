import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserRole, Faculty } from '@/types';
import { useQuery } from '@apollo/client/react';
import { GET_CURRENT_USER } from '@/graphql/queries';
import { storageService } from '@/services/storageService';

interface AuthContextType {
    userRole: UserRole;
    currentFacultyId: string | null;
    currentFaculty: Faculty | undefined;
    currentStudent: any | undefined;
    token: string | null;
    login: (role: UserRole, token: string, user: any) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userRole, setUserRole] = useState<UserRole>(() => {
        return (localStorage.getItem('ldce_user_role') as UserRole) || UserRole.STUDENT;
    });
    const [currentFacultyId, setCurrentFacultyId] = useState<string | null>(() => {
        return localStorage.getItem('ldce_faculty_id');
    });
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('ldce_auth_token');
    });
    const [user, setUser] = useState<any>(() => {
        try {
            const saved = localStorage.getItem('ldce_user_data');
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    });
    const [isLoading, setIsLoading] = useState(true);

    const { data, error, loading: queryLoading } = useQuery<{ getCurrentUser: any }>(GET_CURRENT_USER, {
        skip: !token
    });

    useEffect(() => {
        if (!token) {
            setIsLoading(false);
            return;
        }
        if (!queryLoading) {
            setIsLoading(false);
        }
    }, [token, queryLoading]);

    useEffect(() => {
        if (data?.getCurrentUser) {
            const userData = data.getCurrentUser;
            setUser(userData);
            localStorage.setItem('ldce_user_data', JSON.stringify(userData));

            // Ensure state role matches object role
            if (userData.role && userData.role !== userRole) {
                const normalizedRole = userData.role.toUpperCase() as UserRole;
                setUserRole(normalizedRole);
                localStorage.setItem('ldce_user_role', normalizedRole);
            }
        }
    }, [data, userRole]);

    useEffect(() => {
        if (error) {
            logout();
        }
    }, [error]);

    const login = async (role: UserRole, authToken: string, userData: any) => {
        const normalizedRole = role.toUpperCase() as UserRole;
        setUserRole(normalizedRole);
        setToken(authToken);
        setUser(userData);
        localStorage.setItem('ldce_auth_token', authToken);
        localStorage.setItem('ldce_user_role', normalizedRole);
        localStorage.setItem('ldce_user_data', JSON.stringify(userData));

        if (normalizedRole === UserRole.FACULTY && userData.id) {
            setCurrentFacultyId(userData.id);
            localStorage.setItem('ldce_faculty_id', userData.id);
        }
    };

    const logout = () => {
        setUserRole(UserRole.STUDENT);
        setCurrentFacultyId(null);
        setToken(null);
        setUser(null);
        localStorage.removeItem('ldce_auth_token');
        localStorage.removeItem('ldce_user_role');
        localStorage.removeItem('ldce_faculty_id');
        localStorage.removeItem('ldce_user_data');
        setIsLoading(false);
    };

    // Derived values for components
    const currentUser = data?.getCurrentUser || user;
    const effectiveRole = currentUser?.role?.toUpperCase() || userRole.toUpperCase();

    return (
        <AuthContext.Provider
            value={{
                userRole: effectiveRole as UserRole,
                currentFacultyId,
                currentFaculty: effectiveRole === UserRole.FACULTY ? currentUser : undefined,
                currentStudent: effectiveRole === UserRole.STUDENT ? currentUser : undefined,
                token,
                login,
                logout,
                isLoading: isLoading || queryLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
