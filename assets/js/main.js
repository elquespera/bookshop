import { $ } from "./page-render.js";

// Get & Set CSS variables
const getCSSVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name);

// Change navbar background transparency on scroll
document.addEventListener("scroll", () => {
    const headerHeight = parseInt(getCSSVar('--header-height')) + parseInt(getCSSVar('--navbar-height'));
    const opacity = Math.min(0.95, (document.documentElement.scrollTop / headerHeight).toFixed(2));    
    let color = getComputedStyle($('header')).backgroundColor;
    color = color.match(/[\.\d]+/g);
    $('nav').style.backgroundColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
});