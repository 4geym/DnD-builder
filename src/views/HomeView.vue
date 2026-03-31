<script setup>
import { ref } from 'vue'

// Дерево папок/модулей
const treeData = ref([
  {
    id: 'root',
    name: 'D&D Builder',
    type: 'root',
    expanded: true,
    children: [
      {
        id: 'tools',
        name: 'Інструменти',
        type: 'folder',
        expanded: true,
        children: [
          {
            id: 'character',
            name: 'Генератор персонажів',
            type: 'file',
            icon: '⚔️',
            description: 'Створюйте болванки персонажів для D&D',
            link: '/character',
            color: '#8fbc8f'
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
</script>

<template>
  <main>
    <header class="hero">
      <h1>D&D Builder</h1>
      <p class="subtitle">Інструменти для майстрів та гравців</p>
    </header>

    <section class="catalog">
      <h2>Каталог інструментів</h2>
      
      <!-- Древовидная структура -->
      <div class="tree-container">
        <template v-for="item in treeData" :key="item.id">
          <div class="tree-item-wrapper">
            <!-- Рекурсивный рендеринг дерева -->
            <template v-for="node in [item]" :key="node.id">
              <div 
                :class="['tree-node', node.type, { expanded: node.expanded, root: node.type === 'root' }]"
              >
                <!-- Строки дерева -->
                <div class="tree-lines" v-if="node.type !== 'root'">
                  <span class="tree-line-vertical"></span>
                </div>
                
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
                    <span class="node-icon">{{ node.icon || '📁' }}</span>
                    <span class="node-name">{{ node.name }}</span>
                  </router-link>
                  
                  <div v-else class="folder-link">
                    <span class="expand-icon">
                      <template v-if="node.type === 'folder'">
                        <span v-if="node.expanded">▼</span>
                        <span v-else>▶</span>
                      </template>
                    </span>
                    <span class="node-icon">{{ node.type === 'root' ? '💾' : '📁' }}</span>
                    <span class="node-name">{{ node.name }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Рекурсивные дочерние элементы -->
              <div v-if="node.children && node.expanded" class="tree-children">
                <template v-for="child in node.children" :key="child.id">
                  <div :class="['tree-node', child.type, { expanded: child.expanded }]">
                    <div class="tree-lines">
                      <span class="tree-line-vertical"></span>
                    </div>
                    
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
                        <span class="node-icon">{{ child.icon || '📄' }}</span>
                        <span class="node-name">{{ child.name }}</span>
                      </router-link>
                      
                      <div v-else class="folder-link">
                        <span class="expand-icon">
                          <span v-if="child.expanded">▼</span>
                          <span v-else>▶</span>
                        </span>
                        <span class="node-icon">📁</span>
                        <span class="node-name">{{ child.name }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Вложенные дети второго уровня -->
                  <div v-if="child.children && child.expanded" class="tree-children">
                    <template v-for="subchild in child.children" :key="subchild.id">
                      <div :class="['tree-node', subchild.type, { expanded: subchild.expanded }]">
                        <div class="tree-lines">
                          <span class="tree-line-vertical"></span>
                        </div>
                        
                        <div class="tree-content">
                          <router-link 
                            v-if="subchild.type === 'file'" 
                            :to="subchild.link"
                            class="file-link"
                            :style="{ '--accent-color': subchild.color }"
                          >
                            <span class="node-icon">{{ subchild.icon || '📄' }}</span>
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
    </section>
  </main>
</template>

<style>
main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.hero {
  text-align: center;
  margin-bottom: 3rem;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border-radius: 12px;
  color: #fff;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  letter-spacing: 2px;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.catalog {
  margin-bottom: 3rem;
}

.catalog h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

/* Tree Styles */
.tree-container {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 1.5rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.tree-item-wrapper {
  width: 100%;
}

.tree-node {
  display: flex;
  align-items: stretch;
  min-height: 32px;
}

.tree-node.root {
  margin-bottom: 0.5rem;
}

.tree-node.root .tree-content {
  background: transparent;
  padding: 0.5rem;
}

.tree-lines {
  width: 24px;
  display: flex;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}

.tree-line-vertical {
  width: 2px;
  background: #4a4a4a;
  position: absolute;
  top: 0;
  bottom: 0;
}

.tree-children {
  padding-left: 24px;
}

.tree-content {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 6px 12px;
  margin: 2px 0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tree-content:hover {
  background: #2d2d2d;
}

.tree-content.folder {
  color: #569cd6;
}

.tree-content.root {
  font-size: 1.2rem;
  font-weight: 600;
  color: #dcdcaa;
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
  color: #9cdcfe;
  transition: all 0.2s ease;
}

.file-link:hover {
  background: #37373d;
  border-radius: 4px;
  color: var(--accent-color);
}

.file-link:hover .node-icon {
  transform: scale(1.1);
}

.expand-icon {
  width: 16px;
  font-size: 10px;
  color: #6a6a6a;
  transition: transform 0.2s ease;
}

.node-icon {
  font-size: 1.1rem;
  width: 24px;
  text-align: center;
  transition: transform 0.2s ease;
}

.node-name {
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Описание файла */
.file-link {
  position: relative;
}

.file-link::after {
  content: attr(data-description);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 12px;
  background: #252526;
  color: #808080;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 10;
}

.file-link:hover::after {
  opacity: 1;
}

@media (max-width: 600px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .tree-container {
    padding: 1rem;
  }
  
  .tree-children {
    padding-left: 12px;
  }
  
  .tree-lines {
    width: 12px;
  }
}
</style>
