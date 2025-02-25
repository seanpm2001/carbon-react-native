import React from 'react';
import { ViewProps, StyleProp, StyleSheet, ViewStyle, Pressable, View, PressableStateCallbackType } from 'react-native';
import { getColor } from '../../styles/colors';
import { createIcon, pressableFeedbackStyle, styleReferenceBreaker } from '../../helpers';
import type { NavigationButton } from '../../types/navigation';
import { Text } from '../Text';
import { SemiBoldFont } from '../../styles/typography';

export type BottomNavigationBarProps = {
  /** Navigation items to load */
  items: NavigationButton[];
  /** Style to set on the item */
  style?: StyleProp<ViewStyle>;
  /** Direct props to set on the React Native component (including iOS and Android specific props). Most use cases should not need this. */
  componentProps?: ViewProps;
};

export class BottomNavigationBar extends React.Component<BottomNavigationBarProps> {
  private get styles() {
    return StyleSheet.create({
      wrapper: {
        height: 49,
        maxHeight: 49,
        width: '100%',
        backgroundColor: getColor('layer01'),
        flexDirection: 'row',
        borderTopColor: getColor('borderSubtle01'),
        borderTopWidth: 1,
      },
      itemStyle: {
        borderTopColor: getColor('layer01'),
        borderTopWidth: 4,
        paddingTop: 6,
        textAlign: 'center',
        flex: 1,
        paddingRight: 2,
        paddingLeft: 2,
      },
      icon: {
        marginRight: 'auto',
        marginLeft: 'auto',
      },
      textActive: {
        ...SemiBoldFont(),
      },
    });
  }

  private get items(): React.ReactNode {
    const { items } = this.props;

    return items.map((item, index) => {
      const finalStyles = styleReferenceBreaker(this.styles.itemStyle, item.style);
      let finalColor = getColor('iconSecondary');
      let useActiveText = false;

      if (item.disabled) {
        finalColor = getColor('iconDisabled');
      } else if (item.active) {
        finalColor = getColor('iconPrimary');
        finalStyles.borderTopColor = getColor('borderInteractive');
        useActiveText = true;
      }

      const getStateStyle = (state: PressableStateCallbackType): StyleProp<ViewStyle> => {
        return state.pressed
          ? {
              backgroundColor: getColor('layerActive01'),
              borderTopColor: item.active ? getColor('borderInteractive') : getColor('layerActive01'),
            }
          : undefined;
      };

      return (
        <Pressable key={index} style={(state) => pressableFeedbackStyle(state, finalStyles, getStateStyle)} disabled={item.disabled} onPress={item.onPress} onLongPress={item.onLongPress} accessibilityLabel={item.text} accessibilityRole="tab" {...(item.componentProps || {})}>
          <View style={this.styles.icon}>{createIcon(item.icon, 20, 20, finalColor)}</View>
          <Text style={styleReferenceBreaker(useActiveText ? this.styles.textActive : {}, { color: finalColor, textAlign: 'center' })} text={item.text} type="label-01" breakMode="tail" />
        </Pressable>
      );
    });
  }

  render(): React.ReactNode {
    const { componentProps, style } = this.props;
    const finalStyles = styleReferenceBreaker(this.styles.wrapper, style);

    return (
      <View style={finalStyles} accessibilityRole="tablist" {...(componentProps || {})}>
        {this.items}
      </View>
    );
  }
}
