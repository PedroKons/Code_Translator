const API_URL = 'https://api.pktech.fun';

export async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}


export async function getRandomPhrase(token) {
    const response = await fetch(`${API_URL}/phrases/random`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return response.json()
}

export async function submitGuess(token, phraseId, userAnswer) {
    const response = await fetch(`${API_URL}/phrases/${phraseId}/guess`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userAnswer })
    })
    return response.json()
}

export async function registerUser(email, password, name) {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json();
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

export async function getUser(token) {
    try {
        const response = await fetch(`${API_URL}/me`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json()
    } catch (error) {
        console.error('User error:', error);
        throw error;
    }
}

export async function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
}



