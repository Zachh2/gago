export async function getCookie(email, password, port) {
  try {
    const response = await fetch(`https://cookie-5qb0.onrender.com/login?email=${email}&password=${password}`);
    const data = await response.json();
    if (data.error) {
      return "Invalid Email/ID/Number or Password";
    }
    const cookie = data.cookie.replace(/\s*=\s*/g, '=');
    return cookie;
  } catch (error) {
    return error;
  }
}
