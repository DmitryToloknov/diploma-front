import {BASE_ERROR, SERVER_URL} from "../../../utils/constant.js";

export const fetchUserType = async (accessToken) => {
    try {
        const response = await fetch(`${SERVER_URL}user-type`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            }
        });
        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        const data = await response.json();
        return {success: true, data: data};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const fetchGroups = async (accessToken) => {
    try {
        const response = await fetch(`${SERVER_URL}group`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            }
        });
        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        const data = await response.json();
        return {success: true, data: data};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const countUser = async (accessToken, filter) => {
    try {
        const response = await fetch(`${SERVER_URL}user/count`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,

            },
            body: JSON.stringify(filter)
        });
        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        const data = await response.text();
        return {success: true, data: Number(data)};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const getUsers = async (accessToken, filter, page, perPage) => {
    try {

        const response = await fetch(`${SERVER_URL}user/${page}/${perPage}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,

            },
            body: JSON.stringify(filter)
        });

        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        const data = await response.json();
        return {success: true, data: data};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const deleteUser = async (accessToken, userDeleteRequest, id) => {
    try {

        const response = await fetch(`${SERVER_URL}user/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,

            },
            body: JSON.stringify(userDeleteRequest)
        });

        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        return {success: true, data: "Пользователь успешно деактивирован."};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const createUser = async (accessToken, createUser) => {
    try {

        const response = await fetch(`${SERVER_URL}auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,

            },
            body: JSON.stringify(createUser)
        });

        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        return {success: true, data: "Пользователь успешно создан."};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const findUserById = async (accessToken, id) => {
    try {

        const response = await fetch(`${SERVER_URL}user/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,

            },
        });

        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        const data = await response.json();
        return {success: true, data: data};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const saveUser = async (accessToken, updateUser, id) => {
    try {

        const response = await fetch(`${SERVER_URL}user/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,

            },
            body: JSON.stringify(updateUser)
        });

        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        return {success: true, data: "Пользователь успешно обновлен."};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const updatePassword = async (accessToken, newPassword, id) => {
    try {

        const response = await fetch(`${SERVER_URL}auth/${id}/update-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,

            },
            body: JSON.stringify(newPassword)
        });

        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        return {success: true, data: "Пароль успешно изменен."};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const getFullRoles = async (accessToken) => {
    try {

        const response = await fetch(`${SERVER_URL}user/roles`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,

            },
        });

        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        const data = await response.json();
        return {success: true, data: data};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const getActualRoles = async (accessToken, id) => {
    try {

        const response = await fetch(`${SERVER_URL}user/${id}/roles`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        const data = await response.json();
        return {success: true, data: data};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const updateRoles = async (accessToken, roles, id) => {
    try {

        const response = await fetch(`${SERVER_URL}user/${id}/roles`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,

            },
            body: JSON.stringify(roles)
        });

        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        return {success: true, data: "Роли успешно изменены."};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};
