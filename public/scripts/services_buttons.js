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
  window.location.href = '/ateliers.html'
})

const buttonNutrition = document.querySelector('.button_nutrition');

buttonNutrition.addEventListener('click', e => {
  e.preventDefault()
  e.stopPropagation()
  window.location.href = '/nutrition.html'
})

const buttonRecipies = document.querySelector('.button_recipies');

buttonRecipies.addEventListener('click', e => {
  e.preventDefault()
  e.stopPropagation()
  window.location.href = '/recipes.html'
})