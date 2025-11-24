#!/usr/bin/env node

/**
 * Script para configurar o IP local automaticamente
 * 
 * Uso:
 * node configure-ip.js
 * 
 * Ou especificar IP:
 * node configure-ip.js 192.168.1.100
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

// Função para obter o IP local
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Pular endereços internos e não IPv4
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  return '192.168.1.100'; // Fallback
}

// Obter IP da linha de comando ou detectar automaticamente
const newIP = process.argv[2] || getLocalIP();

console.log('🔧 Configurando IP local para:', newIP);
console.log('');

// Arquivos para atualizar
const files = [
  {
    path: path.join(__dirname, 'services', 'googleAuthService.js'),
    patterns: [
      {
        pattern: /const API_URL = 'http:\/\/[\d.]+:8080'/g,
        replacement: `const API_URL = 'http://${newIP}:8080'`
      }
    ]
  },
  {
    path: path.join(__dirname, 'services', 'api.js'),
    patterns: [
      {
        pattern: /const API_URL = 'http:\/\/[\d.]+:8080'/g,
        replacement: `const API_URL = 'http://${newIP}:8080'`
      }
    ]
  }
];

// Atualizar arquivos
let updated = 0;

files.forEach(file => {
  try {
    const filePath = file.path;
    let content = fs.readFileSync(filePath, 'utf8');
    let fileUpdated = false;
    
    file.patterns.forEach(({ pattern, replacement }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        fileUpdated = true;
      }
    });
    
    if (fileUpdated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Atualizado: ${path.basename(filePath)}`);
      updated++;
    } else {
      console.log(`⚠️  Padrão não encontrado em: ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`❌ Erro ao atualizar ${path.basename(file.path)}:`, error.message);
  }
});

console.log('');
console.log(`📊 Total de arquivos atualizados: ${updated}`);
console.log('');
console.log('⚠️  IMPORTANTE: Você também precisa atualizar o backend!');
console.log('');
console.log('📝 Arquivo do backend:');
console.log('   Back-end/src/main/java/com/ong/backend/config/OAuth2SuccessHandler.java');
console.log('');
console.log('🔍 Procure por:');
console.log(`   "exp://192.168.15.14:8081/--/oauth2/callback?token=%s..."`);
console.log('');
console.log('🔄 Substitua por:');
console.log(`   "exp://${newIP}:8081/--/oauth2/callback?token=%s..."`);
console.log('');
console.log('✅ Depois reinicie o backend!');
console.log('');
console.log('💡 Dica: O IP atual do backend é 192.168.15.14');
console.log('   Se você mudou para outro IP, atualize manualmente!');
