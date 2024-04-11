import React from 'react';
import FastImage from 'react-native-fast-image';
import {ImageStyle, StyleProp} from 'react-native';

interface SourceProp {
  uri: string;
}

interface CachedImageProps {
  source: SourceProp;
  style?: StyleProp<ImageStyle>;
}

// CachedImage component for displaying images with caching and efficiency benefits
const CachedImage: React.FC<CachedImageProps> = ({source: {uri}, style}) => {
  return (
    <FastImage
      style={style as any}
      source={{
        uri,
        priority: FastImage.priority.normal,
      }}
      resizeMode={FastImage.resizeMode.contain}
    />
  );
};

export default CachedImage;
