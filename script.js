// Get & Set CSS variables
const getCSSVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name);
const setCSSVar = (name, value) => document.documentElement.style.setProperty(name, value);



// Change navbar background transparency on scroll
document.addEventListener("scroll", () => {
    const navbar = document.querySelector('nav');
    const currentPosition = document.documentElement.scrollTop;
    const headerHeight = parseInt(getCSSVar('--header-height')) + parseInt(getCSSVar('--navbar-height'));
    const opacity = Math.min(0.95, (currentPosition / headerHeight).toFixed(2));    
    let color = getComputedStyle(document.querySelector('header')).backgroundColor;
    color = color.match(/[\.\d]+/g);
    navbar.style.backgroundColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
});