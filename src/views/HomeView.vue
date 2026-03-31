<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Системная информация
const systemInfo = ref({
  time: '',
  date: '',
  timezone: '',
  browser: '',
  os: '',
  screenResolution: ''
})

// Обновление времени
const updateTime = () => {
  const now = new Date()
  systemInfo.value.time = now.toLocaleTimeString('ru-RU', { hour12: false })
  systemInfo.value.date = now.toLocaleDateString('ru-RU')
  systemInfo.value.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
}

// Определение браузера
const getBrowser = () => {
  const ua = navigator.userAgent
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome'
  if (ua.includes('Edg')) return 'Edge'
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari'
  if (ua.includes('MSIE') || ua.includes('Trident')) return 'Internet Explorer'
  return 'Unknown'
}

// Определение ОС
const getOS = () => {
  const ua = navigator.userAgent
  if (ua.includes('Windows')) return 'Windows'
  if (ua.includes('Mac')) return 'macOS'
  if (ua.includes('Linux')) return 'Linux'
  if (ua.includes('Android')) return 'Android'
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS'
  return 'Unknown'
}

// Получение системной информации
const getSystemInfo = () => {
  updateTime()
  systemInfo.value.browser = getBrowser()
  systemInfo.value.os = getOS()
  systemInfo.value.screenResolution = `${window.screen.width}x${window.screen.height}`
}

let timeInterval = null

onMounted(() => {
  getSystemInfo()
  // Обновлять время каждую секунду
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})

// Дерево папок/модулей
const treeData = ref([
  {
    id: 'root',
    name: 'User',
    type: 'root',
    expanded: true,
    children: [
      {
        id: 'tools',
        name: '[TOOLS]',
        type: 'folder',
        expanded: true,
        children: [
          {
            id: 'character',
            name: 'CHARACTER_GEN.EXE',
            type: 'file',
            icon: '[>]',
            description: 'Створюйте болванки персонажів для D&D',
            link: '/character',
            color: '#33ff33'
          }
        ]
      }
    ]
  }
])

// Переключение раскрытия папки
const toggleFolder = (item) => {
  if (item.type === 'folder') {
    item.expanded = !item.expanded
  }
}

// Сообщение BIOS-стиля
const biosMessage = ref('System ready...')
</script>

<template>
  <main>
    <div class="bios-screen">
      <!-- BIOS Header -->
      <div class="bios-header">
        <pre class="bios-logo">
 ██████╗██╗      █████╗ ██████╗  █████╗ ██████╗ ██████╗ ███████╗██████╗ 
██╔════╝██║     ██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗
██║     ██║     ███████║██████╔╝███████║██████╔╝██║  ██║█████╗  ██████╔╝
██║     ███╗    ██╔══██║██╔══██╗██╔══██║██╔═══╝ ██║  ██║██╔══╝  ██╔══██╗
╚██████╗███████╗██║  ██║██║  ██║██║  ██║██║     ██████╔╝███████╗██║  ██║
 ╚═════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═════╝ ╚══════╝╚═╝  ╚═╝
        </pre>
        <div class="bios-version">VOLYXD BIOS v1.0.0</div>
        <div class="bios-divider">══════════════════════════════════════════════════════════════════════</div>
      </div>

      <!-- Main Content -->
      <div class="bios-content">
        <div class="menu-section">
          <div class="section-title">> MAIN MENU</div>
          <div class="divider-line">──────────────────────────────────────</div>
          
          <!-- Древовидная структура -->
          <div class="tree-container">
            <template v-for="item in treeData" :key="item.id">
              <div class="tree-item-wrapper">
                <!-- Рекурсивный рендеринг дерева -->
                <template v-for="node in [item]" :key="node.id">
                  <div 
                    :class="['tree-node', node.type, { expanded: node.expanded, root: node.type === 'root' }]"
                  >
                    <!-- Контент элемента -->
                    <div 
                      :class="['tree-content', node.type]"
                      @click="node.type === 'folder' ? toggleFolder(node) : null"
                    >
                      <router-link 
                        v-if="node.type === 'file'" 
                        :to="node.link"
                        class="file-link"
                        :style="{ '--accent-color': node.color }"
                      >
                        <span class="node-icon">{{ node.icon }}</span>
                        <span class="node-name">{{ node.name }}</span>
                      </router-link>
                      
                      <div v-else class="folder-link">
                        <span class="expand-icon">
                          <template v-if="node.type === 'folder'">
                            <span v-if="node.expanded">[-]</span>
                            <span v-else>[+]</span>
                          </template>
                        </span>
                        <span class="node-name">{{ node.name }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Рекурсивные дочерние элементы -->
                  <div v-if="node.children && node.expanded" class="tree-children">
                    <template v-for="child in node.children" :key="child.id">
                      <div :class="['tree-node', child.type, { expanded: child.expanded }]">
                        <div 
                          :class="['tree-content', child.type]"
                          @click="child.type === 'folder' ? toggleFolder(child) : null"
                        >
                          <router-link 
                            v-if="child.type === 'file'" 
                            :to="child.link"
                            class="file-link"
                            :style="{ '--accent-color': child.color }"
                          >
                            <span class="node-icon">{{ child.icon }}</span>
                            <span class="node-name">{{ child.name }}</span>
                            <span class="file-description">{{ child.description }}</span>
                          </router-link>
                          
                          <div v-else class="folder-link">
                            <span class="expand-icon">
                              <span v-if="child.expanded">[-]</span>
                              <span v-else>[+]</span>
                            </span>
                            <span class="node-name">{{ child.name }}</span>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Вложенные дети второго уровня -->
                      <div v-if="child.children && child.expanded" class="tree-children">
                        <template v-for="subchild in child.children" :key="subchild.id">
                          <div :class="['tree-node', subchild.type, { expanded: subchild.expanded }]">
                            <div class="tree-content">
                              <router-link 
                                v-if="subchild.type === 'file'" 
                                :to="subchild.link"
                                class="file-link"
                                :style="{ '--accent-color': subchild.color }"
                              >
                                <span class="node-icon">{{ subchild.icon }}</span>
                                <span class="node-name">{{ subchild.name }}</span>
                              </router-link>
                            </div>
                          </div>
                        </template>
                      </div>
                    </template>
                  </div>
                </template>
              </div>
            </template>
          </div>
        </div>

        <!-- Info Panel -->
        <div class="info-panel">
          <div class="section-title">> SYSTEM INFO</div>
          <div class="divider-line">──────────────────────────────────────</div>
          <div class="info-content">
            <div class="info-row"><span class="info-label">TIME:</span> <span class="info-value">{{ systemInfo.time }}</span></div>
            <div class="info-row"><span class="info-label">DATE:</span> <span class="info-value">{{ systemInfo.date }}</span></div>
            <div class="info-row"><span class="info-label">TIMEZONE:</span> <span class="info-value">{{ systemInfo.timezone }}</span></div>
            <div class="info-row"><span class="info-label">BROWSER:</span> <span class="info-value">{{ systemInfo.browser }}</span></div>
            <div class="info-row"><span class="info-label">OS:</span> <span class="info-value">{{ systemInfo.os }}</span></div>
            <div class="info-row"><span class="info-label">RESOLUTION:</span> <span class="info-value">{{ systemInfo.screenResolution }}</span></div>
            <div class="info-row"><span class="info-label">STATUS:</span> <span class="info-value blink">{{ biosMessage }}</span></div>
          </div>
        </div>
      </div>

      <!-- BIOS Footer -->
      <div class="bios-footer">
        <div class="divider-line">══════════════════════════════════════════════════════════════════════</div>
        <div class="footer-text">
          <span>Press [ENTER] to select | [TAB] to switch</span>
        </div>
      </div>
    </div>
  </main>
</template>

<style>

* {
  box-sizing: border-box;
}

main {
  min-height: 100vh;
  background: #000000;
  padding: 0;
  margin: 0;
}

.bios-screen {
  font-family: 'VT323', 'Courier New', monospace;
  background: #000000;
  color: #33ff33;
  min-height: 100vh;
  padding: 20px;
  font-size: 18px;
  line-height: 1.2;
}

/* Header Styles */
.bios-header {
  margin-bottom: 20px;
}

.bios-logo {
  font-size: 10px;
  line-height: 10px;
  color: #33ff33;
  margin: 0 0 10px 0;
  text-align: center;
  overflow-x: auto;
}

.bios-version {
  color: #33ff33;
  margin-bottom: 5px;
}

.bios-divider {
  color: #33ff33;
  overflow: hidden;
  white-space: nowrap;
}

/* Content Styles */
.bios-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 800px) {
  .bios-content {
    grid-template-columns: 1fr;
  }
}

.menu-section, .info-panel {
  background: #0a0a0a;
  border: 1px solid #33ff33;
  padding: 15px;
}

.section-title {
  color: #33ff33;
  font-weight: bold;
  margin-bottom: 5px;
}

.divider-line {
  color: #33ff33;
  margin-bottom: 15px;
  overflow: hidden;
  white-space: nowrap;
}

/* Tree Styles */
.tree-container {
  color: #33ff33;
}

.tree-item-wrapper {
  width: 100%;
}

.tree-node {
  display: flex;
  align-items: stretch;
  min-height: 24px;
}

.tree-children {
  padding-left: 20px;
}

.tree-content {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 4px 0;
  cursor: pointer;
  flex-wrap: wrap;
}

.tree-content:hover {
  background: #33ff33;
  color: #000000;
}

.tree-content:hover a {
  color: #000000;
}

.folder-link {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.file-link {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  text-decoration: none;
  color: #33ff33;
  flex-wrap: wrap;
}

.file-link:hover {
  background: #33ff33;
  color: #000000;
}

.expand-icon {
  width: 24px;
  font-size: 14px;
}

.node-icon {
  font-size: 16px;
  min-width: 30px;
}

.node-name {
  font-size: 16px;
}

.file-description {
  width: 100%;
  font-size: 14px;
  opacity: 0.8;
  margin-left: 30px;
  margin-top: 2px;
}

/* Info Panel */
.info-content {
  color: #33ff33;
}

.info-row {
  margin-bottom: 8px;
}

.info-label {
  color: #33ff33;
}

.info-value {
  color: #33ff33;
}

.blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Footer */
.bios-footer {
  margin-top: 20px;
}

.footer-text {
  text-align: center;
  margin-top: 10px;
  font-size: 16px;
}

/* Scrollbar for webkit */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #000000;
}

::-webkit-scrollbar-thumb {
  background: #33ff33;
}

::-webkit-scrollbar-corner {
  background: #000000;
}
</style>
