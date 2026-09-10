/** Applies the saved theme before first paint to avoid a flash. */
export function ThemeScript() {
  const code = `try{var t=localStorage.getItem("cloudbase.theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
