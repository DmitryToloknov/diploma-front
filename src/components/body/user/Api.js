import {BASE_ERROR, SERVER_URL} from "../../../utils/constant.js";

export const getUserInfoApi = async (accessToken) => {
    try {
        const response = await fetch(`${SERVER_URL}user/info`, {
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
        return {success: true, data: await response.json()};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const getCoursesProgressApi = async (accessToken) => {
    try {
        const response = await fetch(`${SERVER_URL}course/progress`, {
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
        return {success: true, data: await response.json()};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const getUserSkillsApi = async (accessToken) => {
    try {
        const response = await fetch(`${SERVER_URL}skill/user`, {
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
        return {success: true, data: await response.json()};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};