let inputNama = prompt("Enter your name here:")
document.getElementById('nameInput').innerHTML = inputNama

const background = document.querySelector('html');
const button = document.querySelector('.contrast__link');
button.addEventListener('click', e => {
  e.preventDefault();
  if (background.classList.contains('bg1')) {
    background.classList.remove('bg1');
    background.classList.add('bg2');
  }
  else if (background.classList.contains('bg2')) {
    background.classList.remove('bg2');
    background.classList.add('bg3');
  }
  else if (background.classList.contains('bg3')) {
    background.classList.remove('bg3');
    background.classList.add('bg1');
  }
//   else {
//     background.classList.add('bg1');
//   }
});
