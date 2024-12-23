import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styled from 'styled-components';
import {styles} from '../../styles/styleGuide';
import ArrowIcon from '../../assets/defaultIcon/arrow_icon.svg';
import CheckIcon from '../../assets/defaultIcon/check_icon.svg';

interface AppItemProps {
  appName: string;
  times: number;
  handleLongPress: () => void;
  isSelected?: boolean;
  isLongPress?: boolean;
  handlePress: () => void;
}

const AppItem = ({
  appName,
  times,
  handleLongPress,
  isLongPress,
  isSelected,
  handlePress,
}: AppItemProps) => {
  return (
    <Container
      onLongPress={handleLongPress}
      $isLongPress={isLongPress}
      $isSelected={isSelected}
      onPress={handlePress}>
      <LeftSection>
        {isSelected && isLongPress ? <CheckIcon /> : <Icon />}
        <AppNameText>{appName}</AppNameText>
      </LeftSection>
      <RightSection>
        <TimesText>{times} times</TimesText>
        <ArrowTouchable>
          <ArrowIcon />
        </ArrowTouchable>
      </RightSection>
    </Container>
  );
};

export default AppItem;

const Container = styled(TouchableOpacity)<{
  $isSelected?: boolean;
  $isLongPress?: boolean;
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  height: 52px;
  padding: 12px 0 12px 12px;
  border-radius: 15px;
  background-color: ${props =>
    props.$isLongPress
      ? props.$isSelected
        ? styles.colors.gray[200]
        : styles.colors.gray[50]
      : styles.colors.gray[100]};
  opacity: ${props => (props.$isLongPress && !props.$isSelected ? 0.4 : 1)};
`;

const LeftSection = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RightSection = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const Icon = styled(View)`
  width: 28px;
  height: 28px;
  border-radius: 5px;
  background-color: ${styles.colors.gray[50]};
`;

const AppNameText = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  color: ${styles.colors.gray[800]};
  margin-left: 16px;
`;

const TimesText = styled(Text)`
  font-size: 16px;
  color: ${styles.colors.gray[500]};
`;

const ArrowTouchable = styled(TouchableOpacity)`
  padding: 10px;
`;
