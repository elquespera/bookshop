import { $ } from "./page-render.js";

// Change navbar background transparency on scroll
document.addEventListener("scroll", () => {
    const opacity = Math.min(0.95, (document.documentElement.scrollTop / $('header').offsetHeight).toFixed(2));    
    let color = getComputedStyle($('header')).backgroundColor;
    color = color.match(/[\.\d]+/g);
    $('nav').style.backgroundColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
});

window.addEventListener('resize', (e) => {
    $('header > h2').innerHTML = e.target.innerWidth;
});
