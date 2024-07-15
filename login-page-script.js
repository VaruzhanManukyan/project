const USERS_URL = "https://bever-aca-assignment.azurewebsites.net/users";
const USER_ID = localStorage.getItem("id");
const USER_NAME = localStorage.getItem("name");

if (USER_ID && USER_NAME) {
    window.location.href = "invoices-page.html";
}

async function handleSubmit() {
    const name = document.getElementById("NameId").value;
    const password = document.getElementById("PasswordId").value;

    if (!name || !password) {
        alert("Please fill in all fields");
        return;
    }

    try {
        const dataUsers = await getUsers();
        let user = null;
        for (const dataUser of dataUsers.value) {
            if (dataUser.Name === name && dataUser.Password === password) {
                user = dataUser;
                break;
            }
        }

        if (!user) {
            alert("User not found");
            return;
        }

        localStorage.setItem("id", user.UserId);
        localStorage.setItem("name", user.Name);
        window.location.href = "invoices-page.html";
    } catch (error) {
        console.error(`Error: ${error.message}`);
        alert('Error fetching data');
    }
}

async function getUsers() {
    try {
        const response = await fetch(USERS_URL);
        return await response.json();
    } catch (error) {
        console.error(`Fetch error: ${error.message}`);
        throw new Error('Error fetching data');
    }
}
