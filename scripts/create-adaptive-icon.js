/**
 * Script para criar ícone adaptativo com padding adequado
 * 
 * Para usar, você precisa:
 * 1. Instalar sharp: npm install sharp --save-dev
 * 2. Executar: node scripts/create-adaptive-icon.js
 */

const sharp = require('sharp');
const path = require('path');

const INPUT_IMAGE = path.join(__dirname, '../assets/images/logoOng.png');
const OUTPUT_IMAGE = path.join(__dirname, '../assets/images/logoOngAdaptive.png');

// Tamanho final do ícone adaptativo (1024x1024 recomendado)
const FINAL_SIZE = 1024;
// A logo vai ocupar 50% do espaço total (ajuste conforme necessário)
const LOGO_PERCENTAGE = 0.5;

async function createAdaptiveIcon() {
  try {
    const logoSize = Math.round(FINAL_SIZE * LOGO_PERCENTAGE);
    
    // Redimensionar a logo
    const resizedLogo = await sharp(INPUT_IMAGE)
      .resize(logoSize, logoSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .toBuffer();

    // Criar imagem final com fundo branco e logo centralizada
    await sharp({
      create: {
        width: FINAL_SIZE,
        height: FINAL_SIZE,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .composite([{
      input: resizedLogo,
      gravity: 'center'
    }])
    .png()
    .toFile(OUTPUT_IMAGE);

    console.log('✅ Ícone adaptativo criado com sucesso!');
    console.log(`📁 Salvo em: ${OUTPUT_IMAGE}`);
    console.log('\n📝 Agora atualize o app.json para usar: ./assets/images/logoOngAdaptive.png');
  } catch (error) {
    console.error('❌ Erro ao criar ícone:', error.message);
  }
}

createAdaptiveIcon();
