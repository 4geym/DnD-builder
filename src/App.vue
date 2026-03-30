<script setup>
import { ref, computed } from 'vue'

// === КОНСТАНТИ ТА ДАНІ ===

const RACES = [
  { name: 'Людина', bonuses: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 } },
  { name: 'Ельф', bonuses: { str: 0, dex: 2, con: 0, int: 0, wis: 1, cha: 0 } },
  { name: 'Дворф', bonuses: { str: 2, dex: 0, con: 2, int: 0, wis: 0, cha: 0 } },
  { name: 'Гном', bonuses: { str: 0, dex: 0, con: 2, int: 2, wis: 0, cha: 0 } },
  { name: 'Напів-орк', bonuses: { str: 2, dex: 0, con: 1, int: 0, wis: 0, cha: -1 } }
]

const CLASSES = [
  { 
    name: 'Воїн', 
    hitDice: 10, 
    hitDiceCount: 1,
    primary: 'str', 
    secondary: 'con', 
    saves: ['str', 'con'],
    skills: ['Athletics'],
    proficiencyBonus: 2
  },
  { 
    name: 'Маг', 
    hitDice: 6,
    hitDiceCount: 1,
    primary: 'int', 
    secondary: 'dex', 
    saves: ['int', 'wis'],
    skills: ['Arcana', 'History'],
    proficiencyBonus: 2
  },
  { 
    name: 'Слідопит', 
    hitDice: 10,
    hitDiceCount: 1,
    primary: 'dex', 
    secondary: 'wis', 
    saves: ['dex', 'wis'],
    skills: ['Stealth', 'Survival'],
    proficiencyBonus: 2
  },
  { 
    name: 'Жрець', 
    hitDice: 8,
    hitDiceCount: 1,
    primary: 'wis', 
    secondary: 'str', 
    saves: ['wis', 'cha'],
    skills: ['Medicine', 'Persuasion'],
    proficiencyBonus: 2
  },
  { 
    name: 'Злодій', 
    hitDice: 8,
    hitDiceCount: 1,
    primary: 'dex', 
    secondary: 'int', 
    saves: ['dex', 'int'],
    skills: ['Acrobatics', 'Stealth'],
    proficiencyBonus: 2
  }
]

const ABILITY_NAMES_UA = {
  str: 'Сила',
  dex: 'Спритність',
  con: 'Статура',
  int: 'Інтелект',
  wis: 'Мудрість',
  cha: 'Харизма'
}

const ABILITY_KEYS = ['str', 'dex', 'con', 'int', 'wis', 'cha']

// === REACTIVE STATE ===

const selectedRace = ref('')
const selectedClass = ref('')
const generatedStats = ref(null)
const baseHp = ref(null)

// === КОМП'ЮТОВАНІ ЗНАЧЕННЯ ===

const selectedRaceData = computed(() => {
  return RACES.find(r => r.name === selectedRace.value)
})

const selectedClassData = computed(() => {
  return CLASSES.find(c => c.name === selectedClass.value)
})

// Спасброски - все 6 характеристик
const savingThrows = computed(() => {
  if (!generatedStats.value || !selectedClassData.value) return []
  const classData = selectedClassData.value
  const proficiencyBonus = classData.proficiencyBonus || 2
  const classSaveProficiencies = classData.saves || []
  
  return ABILITY_KEYS.map(key => {
    const isProficient = classSaveProficiencies.includes(key)
    const abilityMod = getModifier(generatedStats.value[key])
    const totalMod = isProficient ? abilityMod + proficiencyBonus : abilityMod
    return {
      ability: ABILITY_NAMES_UA[key],
      value: totalMod,
      formatted: formatModifier(totalMod),
      proficient: isProficient
    }
  })
})

// Все навыки
const characterSkills = computed(() => {
  if (!generatedStats.value || !selectedClassData.value) return []
  const classData = selectedClassData.value
  const proficiencyBonus = classData.proficiencyBonus || 2
  const classProficientSkills = CLASS_SKILLS[classData.name] || []
  
  return SKILLS.map(skill => {
    const isProficient = classProficientSkills.includes(skill.name)
    const abilityMod = getModifier(generatedStats.value[skill.ability])
    const totalMod = isProficient ? abilityMod + proficiencyBonus : abilityMod
    return {
      name: skill.name,
      ability: ABILITY_NAMES_UA[skill.ability],
      value: totalMod,
      formatted: formatModifier(totalMod),
      proficient: isProficient
    }
  })
})

// Класс брони
const armorClass = computed(() => {
  if (!generatedStats.value) return null
  const dexMod = getModifier(generatedStats.value.dex)
  return 10 + dexMod
})

// Ініціатива
const initiative = computed(() => {
  if (!generatedStats.value) return null
  return getModifier(generatedStats.value.dex)
})

// Полный список навыков D&D 5e
const SKILLS = [
  { name: 'Акробатика', ability: 'dex' },
  { name: 'Атлетика', ability: 'str' },
  { name: 'Аналіз', ability: 'int' },
  { name: 'Уважність', ability: 'wis' },
  { name: 'Виживання', ability: 'wis' },
  { name: 'Виступ', ability: 'cha' },
  { name: 'Залякування', ability: 'cha' },
  { name: 'Історія', ability: 'int' },
  { name: 'Спритність рук', ability: 'dex' },
  { name: 'Магія', ability: 'int' },
  { name: 'Медицина', ability: 'wis' },
  { name: 'Обман', ability: 'cha' },
  { name: 'Природа', ability: 'int' },
  { name: 'Проникливість', ability: 'wis' },
  { name: 'Релігія', ability: 'int' },
  { name: 'Потайність', ability: 'dex' },
  { name: 'Переконання', ability: 'cha' },
  { name: 'Догляд за тваринами', ability: 'wis' }
]

// Навычки класса
const CLASS_SKILLS = {
  'Воїн': ['Атлетика', 'Уважність', 'Виживання', 'Залякування', 'Історія', 'Проникливість'],
  'Маг': ['Аналіз', 'Магія', 'Історія', 'Релігія'],
  'Слідопит': ['Уважність', 'Виживання', 'Потайність', 'Спритність рук', 'Проникливіст'],
  'Жрець': ['Медицина', 'Переконання', 'Релігія', 'Проникливість', 'Історія'],
  'Злодій': ['Акробатика', 'Аналіз', 'Обман', 'Потайність', 'Переконання', 'Спритність рук']
}

// Кость хитов
const hitDiceInfo = computed(() => {
  if (!selectedClassData.value || !generatedStats.value) return null
  const classData = selectedClassData.value
  const conMod = getModifier(generatedStats.value.con)
  const hitDice = classData.hitDice
  const hitDiceCount = classData.hitDiceCount || 1
  return {
    dice: `d${hitDice}`,
    count: hitDiceCount,
    total: hitDiceCount * hitDice + conMod
  }
})

// === ЛОГІКА ГЕНЕРАЦІЇ ===

// Алгоритм 4d6 drop lowest
function roll4d6DropLowest() {
  const rolls = []
  for (let i = 0; i < 4; i++) {
    rolls.push(Math.floor(Math.random() * 6) + 1)
  }
  rolls.sort((a, b) => b - a)
  // Підсумовуємо перші 3 (найбільші)
  return rolls[0] + rolls[1] + rolls[2]
}

// Обчислити модифікатор
function getModifier(score) {
  return Math.floor((score - 10) / 2)
}

// Функція генерації характеристик
function generateCharacter() {
  if (!selectedRace.value || !selectedClass.value) {
    alert('Будь ласка, виберіть расу та клас персонажа!')
    return
  }

  const classData = selectedClassData.value
  
  // Генеруємо 6 значень
  const baseRolls = {}
  for (const key of ABILITY_KEYS) {
    baseRolls[key] = roll4d6DropLowest()
  }

  // Сортуємо ключі за значеннями для розподілу
  const sortedAbilityKeys = [...ABILITY_KEYS].sort((a, b) => baseRolls[b] - baseRolls[a])
  const sortedValues = sortedAbilityKeys.map(k => baseRolls[k])
  
  // Пріоритети класу (primary = найвищий, secondary = другий)
  const priorityOrder = [classData.primary, classData.secondary]
  const otherAbilities = ABILITY_KEYS.filter(k => !priorityOrder.includes(k))

  // Створюємо розподілену мапу
  const allocated = {}
  
  // Розподіляємо найвищі значення до пріоритетів класу
  for (let i = 0; i < priorityOrder.length; i++) {
    const ability = priorityOrder[i]
    if (ability) {
      allocated[ability] = sortedValues[i]
    }
  }

  // Решта отримує lower rolls
  let otherIdx = priorityOrder.length
  for (const ability of otherAbilities) {
    allocated[ability] = sortedValues[otherIdx]
    otherIdx++
  }

  // Застосовуємо расові бонуси
  const raceData = selectedRaceData.value
  const finalStats = {}
  for (const key of ABILITY_KEYS) {
    let value = allocated[key]
    if (raceData && raceData.bonuses && raceData.bonuses[key]) {
      value += raceData.bonuses[key]
    }
    // Максимум 20
    finalStats[key] = Math.min(20, value)
  }

  console.log('finalStats:', finalStats)

  generatedStats.value = finalStats

  // Обчислюємо HP для 1-го рівня
  const conMod = getModifier(finalStats.con)
  baseHp.value = classData.hitDice + conMod
}

function formatModifier(mod) {
  if (mod >= 0) return `+${mod}`
  return `${mod}`
}
</script>

<template>
  <main>
    <section>
      <h1>D&D 5e Character Builder</h1>
      <p>Створіть болванку персонажа для настільної рольової гри</p>
    </section>

    <section>
      <h2>Основні параметри</h2>
      <article>
        <label>
          Раса:
          <select v-model="selectedRace">
            <option value="" disabled>Оберіть расу</option>
            <option v-for="race in RACES" :key="race.name" :value="race.name">
              {{ race.name }}
            </option>
          </select>
        </label>

        <label>
          Клас:
          <select v-model="selectedClass">
            <option value="" disabled>Оберіть клас</option>
            <option v-for="cls in CLASSES" :key="cls.name" :value="cls.name">
              {{ cls.name }}
            </option>
          </select>
        </label>

        <button @click="generateCharacter">
          Згенерувати персонажа
        </button>
      </article>
    </section>

    <section v-if="generatedStats">
      <h2>Характеристики персонажа</h2>
      <article>
        <table>
          <thead>
            <tr>
              <th>Характеристика</th>
              <th>Значення</th>
              <th>Модифікатор</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="key in ABILITY_KEYS" :key="key">
              <td>{{ ABILITY_NAMES_UA[key] }}</td>
              <td>{{ generatedStats[key] }}</td>
              <td>{{ formatModifier(getModifier(generatedStats[key])) }}</td>
            </tr>
          </tbody>
        </table>
      </article>
    </section>

    <section v-if="generatedStats">
      <h2>Бойові параметри</h2>
      <article>
        <p><strong>Клас обладунку:</strong> {{ armorClass }}</p>
        <p><strong>Ініціатива:</strong> {{ formatModifier(initiative) }}</p>
        <p><strong>Швидкість:</strong> 30 футів</p>
      </article>
    </section>

    <section v-if="baseHp !== null">
      <h2>Хіти</h2>
      <article>
        <p><strong>HP (1-й рівень):</strong> {{ baseHp }}</p>
        <p><strong>Кістка хітів:</strong> {{ hitDiceInfo.count }}{{ hitDiceInfo.dice }}</p>
      </article>
    </section>

    <section v-if="savingThrows.length > 0">
      <h2>Рятувальні кидки</h2>
      <article>
        <table>
          <thead>
            <tr>
              <th>Характеристика</th>
              <th>Модифікатор</th>
              <th>Перевага</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="save in savingThrows" :key="save.ability">
              <td>{{ save.ability }}</td>
              <td>{{ save.formatted }}</td>
              <td>{{ save.proficient ? '✓' : '—' }}</td>
            </tr>
          </tbody>
        </table>
      </article>
    </section>

    <section v-if="characterSkills.length > 0">
      <h2>Навички</h2>
      <article>
        <table>
          <thead>
            <tr>
              <th>Навичка</th>
              <th>Характеристика</th>
              <th>Модифікатор</th>
              <th>Перевага</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="skill in characterSkills" :key="skill.name">
              <td>{{ skill.name }}</td>
              <td>{{ skill.ability }}</td>
              <td>{{ skill.formatted }}</td>
              <td>{{ skill.proficient ? '✓' : '—' }}</td>
            </tr>
          </tbody>
        </table>
      </article>
    </section>

    </main>
</template>

<style>
/* МІНІМІЛІСТИЧНІ ДОДАТКОВІ СТИЛІ */

main {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

section {
  margin-bottom: 2rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

article {
  padding: 1.5rem;
}

label {
  display: block;
  margin-bottom: 1rem;
}

select, input, textarea {
  width: 100%;
  max-width: 400px;
  margin-top: 0.5rem;
}

button {
  background-color: #8fbc8f;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 4px;
  margin-top: 1rem;
}

button:hover {
  background-color: #7cab7c;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
}

textarea {
  width: 100%;
  max-width: 600px;
  resize: vertical;
}
</style>