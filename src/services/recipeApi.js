
const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Fetch data from the recipe API
async function apiRequest(endpoint) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return await response.json();
}

// Extract ingredients
function getIngredients(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]?.trim();
    const measure = meal[`strMeasure${i}`]?.trim();

    if (ingredient) {
      ingredients.push(
        measure ? `${measure} ${ingredient}` : ingredient
      );
    }
  }

  return ingredients;
}

// Extract cooking instructions
function getInstructions(meal) {
  return (meal.strInstructions || '')
    .split(/\r?\n/)
    .map(step => step.trim())
    .filter(Boolean);
}

// Convert API response into Foodie recipe format
export function mapMealToRecipe(meal) {
  if (!meal) return null;

  const instructions = getInstructions(meal);

  return {
    id: `api-${meal.idMeal}`,
    apiId: meal.idMeal,
    name: meal.strMeal || 'Untitled Recipe',
    category: meal.strCategory || 'Recipe',
    area: meal.strArea || 'International',
    image: meal.strMealThumb || null,
    description: instructions[0]?.slice(0, 150) || '',
    time: 'Not provided by API',
    servings: 'Not provided by API',
    calories: 'Not provided by API',
    difficulty: 'Not rated',
    ingredients: getIngredients(meal),
    instructions,
    sourceUrl: meal.strSource || meal.strYoutube || null,
    fromApi: true,
  };
}

// Search recipes by name
export async function searchMeals(searchTerm = 'chicken') {
  const data = await apiRequest(
    `search.php?s=${encodeURIComponent(searchTerm)}`
  );

  return (data.meals || []).map(mapMealToRecipe);
}

// Get complete recipe details
export async function getMealById(id) {
  const mealId = String(id).replace(/^api-/, '');

  const data = await apiRequest(
    `lookup.php?i=${encodeURIComponent(mealId)}`
  );

  if (!data.meals?.length) {
    throw new Error('Recipe not found.');
  }

  return mapMealToRecipe(data.meals[0]);
}

// Get recipes by category
export async function getMealsByCategory(category) {
  const data = await apiRequest(
    `filter.php?c=${encodeURIComponent(category)}`
  );

  return (data.meals || []).map(meal => ({
    id: `api-${meal.idMeal}`,
    apiId: meal.idMeal,
    name: meal.strMeal,
    image: meal.strMealThumb,
    category,
    ingredients: [],
    instructions: [],
    fromApi: true,
  }));
}

// Get recipe categories
export async function getRecipeCategories() {
  const data = await apiRequest('categories.php');
  return data.categories || [];
}

// Get a random recipe
export async function getRandomMeal() {
  const data = await apiRequest('random.php');

  if (!data.meals?.length) {
    throw new Error('Could not load a random recipe.');
  }

  return mapMealToRecipe(data.meals[0]);
}
