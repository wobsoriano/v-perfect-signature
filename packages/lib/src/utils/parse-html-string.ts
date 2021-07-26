export default function parseHTML(html: string) {
    const t = document.createElement('template');
    t.innerHTML = html;
    return t.content;
}