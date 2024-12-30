import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components/native';
import MapView, {Marker, Region} from 'react-native-maps';
import {View, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {styles} from '../../styles/styleGuide';
import clusterData from '../../utils/clusterData';
import {debounce} from 'lodash';

const MapReport = () => {
  const [region, setRegion] = useState<Region>({
    latitude: 36.1296, // Las Vegas Convention Center Latitude
    longitude: -115.1676, // Las Vegas Convention Center Longitude
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });


  const zoomButtonPressed = useRef(false);

  const [clusters, setClusters] = useState<
    Array<{latitude: number; longitude: number; count: number}>
  >([]);

  const data = [
      {latitude: 36.1300, longitude: -115.1678},
      {latitude: 36.1302, longitude: -115.1680},
      {latitude: 36.1298, longitude: -115.1674},
      {latitude: 36.1296, longitude: -115.1679},
      {latitude: 36.1304, longitude: -115.1682},
    ];

 useEffect(() => {
     console.log('Map region updated:', region);
     const baseThreshold = 100;
     const threshold = baseThreshold * region.latitudeDelta * 100;

     console.log('Clustering threshold:', threshold);
     console.log('Raw data for clustering:', data);

     const clusteredData = clusterData(data, threshold);
     console.log('Clustered data:', clusteredData);

     setClusters(clusteredData);
   }, [region]);

  const zoomIn = () => {
    zoomButtonPressed.current = true;
    setRegion(prevRegion => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta / 2,
      longitudeDelta: prevRegion.longitudeDelta / 2,
    }));
  };

  const zoomOut = () => {
    zoomButtonPressed.current = true;
    setRegion(prevRegion => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 2,
      longitudeDelta: prevRegion.longitudeDelta * 2,
    }));
  };

  const handleRegionChangeComplete = debounce((newRegion: Region) => {
    if (!zoomButtonPressed.current) {
      setRegion(newRegion);
    } else {
      zoomButtonPressed.current = false;
    }
  }, 200);

  return (
    <Container>
      <MapContainer>
        <StyledMap
          region={region}
          onRegionChangeComplete={handleRegionChangeComplete}
          zoomEnabled={true}
          scrollEnabled={true}>
          {clusters.map((cluster, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: cluster.latitude,
                longitude: cluster.longitude,
              }}
              anchor={{x: 0.5, y: 0.5}}>
              <ClusterBubble
                size={30 + Math.log(cluster.count) * 10}
                colors={['#ffffff30', '#B4B4B4']}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}>
                <ClusterText size={30 + Math.log(cluster.count) * 10}>
                  {cluster.count}
                </ClusterText>
              </ClusterBubble>
            </Marker>
          ))}
        </StyledMap>
      </MapContainer>
      <ZoomControls>
        <ZoomButton onPress={zoomIn}>
          <ZoomText>+</ZoomText>
        </ZoomButton>
        <ZoomButton onPress={zoomOut}>
          <ZoomText>-</ZoomText>
        </ZoomButton>
      </ZoomControls>
    </Container>
  );
};

const Container = styled(View)`
  width: 100%;
  height: 289px;
  justify-content: center;
  align-items: center;
`;

const MapContainer = styled(View)`
  width: 100%;
  height: 100%;
  border-radius: 30px;
  overflow: hidden;
`;

const StyledMap = styled(MapView)`
  flex: 1;
`;

const ClusterBubble = styled(LinearGradient)<{size: number}>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: ${props => props.size / 2}px;
  justify-content: center;
  align-items: center;
`;

const ClusterText = styled(Text)<{size: number}>`
  color: ${styles.colors.gray[600]};
  font-size: ${props => props.size / 3}px;
  font-weight: bold;
`;

const ZoomControls = styled(View)`
  position: absolute;
  top: 14px;
  right: 14px;
  flex-direction: column;
  gap: 1px;
`;

const ZoomButton = styled(TouchableOpacity)`
  background-color: rgba(181, 181, 181, 0.726);
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
`;

const ZoomText = styled(Text)`
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

export default MapReport;
