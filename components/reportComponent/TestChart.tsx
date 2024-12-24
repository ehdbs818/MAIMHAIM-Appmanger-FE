import React, {useRef, useState} from 'react';
import {View, ScrollView, Text} from 'react-native';
import Svg, {Rect, Defs, ClipPath, Path, Line} from 'react-native-svg';
import styled from 'styled-components';
import {styles} from '../../styles/styleGuide';

const roundUpToNearest = (num: number, multiple: number) => {
  return Math.ceil(num / multiple) * multiple;
};

const TestChart = ({data}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const chartScrollRef = useRef<ScrollView>(null);
  const labelScrollRef = useRef<ScrollView>(null);
  const chartHeight = 176;
  const barWidth = 36;
  const barSpacing = 32;
  const leftMargin = 44;
  const rightMargin = 44;
  const yAxisSteps = 4;
  const rawMaxValue = Math.max(...data.map(item => item.value));
  const maxValue = roundUpToNearest(rawMaxValue, 5);
  const tempChartWidth =
    leftMargin +
    data.length * (barWidth + barSpacing) -
    barSpacing +
    rightMargin;
  const chartWidth =
    tempChartWidth > containerWidth ? tempChartWidth : containerWidth;

  const handleScroll = event => {
    const scrollX = event.nativeEvent.contentOffset.x;
    if (labelScrollRef.current) {
      labelScrollRef.current.scrollTo({x: scrollX, animated: false}); // Disable animation for fast sync
    }
  };

  return (
    <ChartContainer>
      <LeftSection>
        <ChartCard
          onLayout={event => setContainerWidth(event.nativeEvent.layout.width)}>
          <ScrollView
            ref={chartScrollRef}
            horizontal
            contentContainerStyle={{width: chartWidth}}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={1}
            onScroll={handleScroll}
            alwaysBounceHorizontal={false}
            overScrollMode="never"
            bounces={false}>
            <Svg height={chartHeight} width={chartWidth}>
              {[...Array(yAxisSteps + 1)].map((_, index) => {
                const y = (chartHeight / yAxisSteps) * index;
                return (
                  <Line
                    key={index}
                    x1="0"
                    y1={y}
                    x2={chartWidth}
                    y2={y}
                    stroke={styles.colors.gray[100]}
                    strokeWidth="1"
                  />
                );
              })}

              {data.map((item, index) => {
                const barHeight = (item.value / maxValue) * chartHeight;
                const x = leftMargin + index * (barWidth + barSpacing); // 첫 번째 바에 왼쪽 마진 추가
                const y = chartHeight - barHeight;

                return (
                  <React.Fragment key={index}>
                    <Defs>
                      <ClipPath id={`clip-${index}`}>
                        <Path
                          d={`M${x},${y + barHeight} 
                           L${x},${y + 10} 
                           Q${x},${y} ${x + 10},${y} 
                           L${x + barWidth - 10},${y} 
                           Q${x + barWidth},${y} ${x + barWidth},${y + 10} 
                           L${x + barWidth},${y + barHeight} Z`}
                        />
                      </ClipPath>
                    </Defs>
                    <Rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill={item.color}
                      clipPath={`url(#clip-${index})`}
                    />
                  </React.Fragment>
                );
              })}
            </Svg>
          </ScrollView>
        </ChartCard>
        <XLabelContainer
          ref={labelScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 24,
            width: chartWidth,
          }}>
          {[...Array(data.length)].map((_, index) => {
            return <XLabel key={index} />;
          })}
        </XLabelContainer>
      </LeftSection>
      <YLabelContainer>
        {[...Array(yAxisSteps + 1)].map((_, index) => {
          const labelValue = maxValue - (maxValue / yAxisSteps) * index;
          return <YLabel key={index}>{Math.round(labelValue)}</YLabel>;
        })}
      </YLabelContainer>
    </ChartContainer>
  );
};

const ChartContainer = styled(View)`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 9px;
`;

const YLabelContainer = styled(View)`
  height: 192px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const YLabel = styled(Text)`
  color: ${styles.colors.gray[200]};
  font-size: 12px;
`;

const LeftSection = styled(View)`
  flex: 1;
  display: flex;
  gap: 4px;
`;

const XLabelContainer = styled(ScrollView)`
  padding: 0 40px;
`;

const XLabel = styled(View)`
  width: 44px;
  height: 44px;
  border-radius: 8.25px;
  border: 1px solid ${styles.colors.gray[200]};
`;

const ChartCard = styled(View)`
  width: 100%;
  margin: 8px 0 8px 0;
  border-radius: 12px;
  border: 1px solid ${styles.colors.gray[100]};
  overflow: hidden;
`;

export default TestChart;
