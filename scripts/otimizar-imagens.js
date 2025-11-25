/**
 * Script para adicionar fadeDuration={0} em todas as imagens do projeto
 * Isso remove a animação de fade e torna o carregamento instantâneo
 * 
 * Execute: node scripts/otimizar-imagens.js
 */

const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, '..', 'screens');

// Ler todos os arquivos .js na pasta screens
fs.readdir(screensDir, (err, files) => {
  if (err) {
    console.error('Erro ao ler diretório:', err);
    return;
  }

  files.forEach(file => {
    if (!file.endsWith('.js')) return;

    const filePath = path.join(screensDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Padrão 1: <Image ... /> sem fadeDuration
    const pattern1 = /<Image\s+([^>]*?)(?<!fadeDuration=\{0\}\s*)\/>/g;
    
    // Padrão 2: <Image ... > ... </Image> sem fadeDuration
    const pattern2 = /<Image\s+([^>]*?)(?<!fadeDuration=\{0\}\s*)>/g;

    // Verificar se já tem fadeDuration
    if (!content.includes('fadeDuration')) {
      // Adicionar fadeDuration={0} em todas as tags Image
      content = content.replace(pattern2, (match) => {
        if (match.includes('fadeDuration')) return match;
        modified = true;
        return match.replace('>', '\n          fadeDuration={0}\n        >');
      });

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Otimizado: ${file}`);
      }
    }
  });

  console.log('\n🚀 Otimização concluída!');
});
