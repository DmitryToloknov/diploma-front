export function formatDate (dateString)  {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(date);
}