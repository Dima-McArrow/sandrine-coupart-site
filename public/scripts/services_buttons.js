const buttonConsult = document.querySelector('.button_consult');

buttonConsult.addEventListener('click', e => {
  e.preventDefault()
  e.stopPropagation()
  window.location.href = '/consultations.html'
})

const buttonAtelier = document.querySelector('.button_atelier');

buttonAtelier.addEventListener('click', e => {
  e.preventDefault()
  e.stopPropagation()
  window.location.href = '/HTML/ateliers.html'
})

const buttonNutrition = document.querySelector('.button_nutrition');

buttonNutrition.addEventListener('click', e => {
  e.preventDefault()
  e.stopPropagation()
  window.location.href = '/HTML/nutrition.html'
})

const buttonRecipies = document.querySelector('.button_recipies');

buttonRecipies.addEventListener('click', e => {
  e.preventDefault()
  e.stopPropagation()
  window.location.href = '/HTML/recipes.html'
})