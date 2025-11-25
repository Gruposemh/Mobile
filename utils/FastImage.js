import React from 'react';
import { Image } from 'react-native';

/**
 * Componente de imagem otimizado para carregamento instantâneo
 * Usa fadeDuration={0} por padrão para remover animação de fade
 */
export const FastImage = ({ fadeDuration = 0, ...props }) => {
  return <Image fadeDuration={fadeDuration} {...props} />;
};

export default FastImage;
