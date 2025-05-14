import {BASE_ERROR, SERVER_URL} from "../../../utils/constant.js";

export const createTaskApi = async (accessToken) => {
    try {
        const response = await fetch(`${SERVER_URL}task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        return {success: true, data: await response.text()};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const deleteTaskApi = async (accessToken, id) => {
    try {
        const response = await fetch(`${SERVER_URL}task/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        return {success: true};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const getSkillsApi = async (accessToken) => {
    try {
        const response = await fetch(`${SERVER_URL}skill`, {
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

export const createTestCaseApi = async (accessToken, taskId) => {
    try {
        const response = await fetch(`${SERVER_URL}test-case/${taskId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        return {success: true};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const getTestCaseApi = async (accessToken, taskId) => {
    try {
        const response = await fetch(`${SERVER_URL}test-case/task/${taskId}`, {
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

export const deleteTestCaseApi = async (accessToken, id) => {
    try {
        const response = await fetch(`${SERVER_URL}test-case/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        return {success: true};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const getTaskApi = async (accessToken, id) => {
    try {
        const response = await fetch(`${SERVER_URL}task/${id}`, {
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

export const updateTaskApi = async (accessToken, task) => {
    try {
        const response = await fetch(`${SERVER_URL}task`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(task)
        });

        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        return {success: true};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const startTaskApi = async (accessToken, id) => {
    try {
        const response = await fetch(`${SERVER_URL}task/${id}/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        return {success: true};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const getCreatorsApi = async (accessToken) => {
    try {
        const response = await fetch(`${SERVER_URL}task/creator`, {
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

export const getTotalTaskApi = async (accessToken, filters) => {
    try {
        const response = await fetch(`${SERVER_URL}task/total`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(filters)
        });

        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        return {success: true, data: parseInt(await response.text(),10)};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const getTasksApi = async (accessToken, filters, page, perPage) => {
    try {
        const response = await fetch(`${SERVER_URL}task/${page}/${perPage}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(filters)
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

export const getLanguagesApi = async (accessToken) => {
    try {
        const response = await fetch(`${SERVER_URL}task/language`, {
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