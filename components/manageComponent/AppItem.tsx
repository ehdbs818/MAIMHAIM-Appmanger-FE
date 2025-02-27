import React, { useEffect } from 'react';
import {Image, Pressable, View, Alert, NativeModules} from 'react-native';
import { Text } from '../../theme/theme';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRecoilState } from 'recoil';
import { AddApplication, ManageApplicationToggle } from '../../atom/atom';
import { useNavigate } from 'react-router-native';
import { activateApp } from '../../services/apiServices'; // API 함수 임포트
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage 임포트
import DatabaseService from '../../utils/DatabaseService';

export const AppItem = ({ apps, searchTerm }: any) => {
    const [toggleStates, setToggleStates] = useRecoilState(ManageApplicationToggle);
    const navigate = useNavigate();
    const [addApp] = useRecoilState(AddApplication);
    const {LeaveHandleModule} = NativeModules;

  // 앱이 렌더링될 때 활성화 상태 초기화
  useEffect(() => {
    if (apps) {
      const initialToggleStates = apps.reduce((acc, category) => {
        category.apps.forEach((app) => {
          acc[app.appId] = app.activate;
        });
        return acc;
      }, {});
      setToggleStates(initialToggleStates);
    }
  }, [apps]);

  // handleToggle 함수 수정
  const handleToggle = async (appId, packageName,ssid) => {
    const newToggleStates = { ...toggleStates, [appId]: !toggleStates[appId] };
    setToggleStates(newToggleStates);

    const memberId = await AsyncStorage.getItem('memberId');
    if (memberId) {
      const activate = newToggleStates[appId];
      try {
        // 서버에 활성화/비활성화 요청
        await activateApp(parseInt(memberId, 10), appId, activate);
        Alert.alert(`앱 ${activate ? '활성화' : '비활성화'} 완료`, `${activate ? '활성화' : '비활성화'}되었습니다.`);

        // 로컬 데이터베이스에 활성화 상태 업데이트
          await DatabaseService.updateAppDetails(packageName, { activate });
          if(activate == false ) await LeaveHandleModule.leaveApp(ssid, activate);
        console.log(`Local database updated for package: ${packageName}`);
      } catch (error) {
        console.error('Error toggling app activation:', error);
        Alert.alert('오류', '앱 활성화 상태 변경 중 문제가 발생했습니다.');
      }
    }
  };

  return (
    <>
      {apps.map((category) => (
        <View key={category.categoryId}>
          <CategoryTitle>{category.categoryName}</CategoryTitle>
          {category.apps.map((item) => {
            if (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
              return (
                <ItemList key={item.appId}>
                  <ItemInner>
                    <ImgNameView>
                      <LogoImage source={{ uri: item.image }} />
                      <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{item.name}</Text>
                    </ImgNameView>
                    <IconView>
                      <ToggleBtn onPress={() => handleToggle(item.appId, item.packageName, item.ssid)} isActive={toggleStates[item.appId]}>
                        <CircleBtn isActive={toggleStates[item.appId]} />
                      </ToggleBtn>
                      <Pressable onPress={() => navigate(`/appmanage/${item.appId}`)}>
                        <Icon name="chevron-forward" size={24} color="#000" />
                      </Pressable>
                    </IconView>
                  </ItemInner>
                </ItemList>
              );
            }
            return null;
          })}
        </View>
      ))}
    </>
  );
};

// Styled components

const ItemList = styled(View)`
  gap: 6px;
  margin-bottom: 21px;
`;

const LogoImage = styled(Image)`
  width: 49px;
  height: 49px;
`;

const ItemInner = styled(View)`
  flex-direction: row;
  border-radius: 13px;
  background: #d9d9d9;
  padding: 15px 20px;
  justify-content: space-between;
  align-items: center;
`;

const ImgNameView = styled(View)`
  gap: 12px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const IconView = styled(View)`
  flex-direction: row;
  gap: 7px;
  align-items: center;
`;

const ToggleBtn = styled(Pressable)<{ isActive?: boolean }>`
  width: 40px;
  background-color: ${({ isActive }) => (isActive ? '#3751c1' : '#888')};
  height: 22px;
  border-radius: 10px;
  position: relative;
  justify-content: center;
`;

const CircleBtn = styled(View)<{ isActive?: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 100px;
  background: #fff;
  position: absolute;
  ${({ isActive }) => (isActive ? 'right: 3px;' : 'left: 3px;')}
`;

const CategoryTitle = styled(Text)`
  font-weight: bold;
  font-size: 18px;
  margin: 10px 0;
`;
