import React from 'react';
import { StyleProp, StyleSheet, Switch, SwitchProps, View, ViewStyle } from 'react-native';
import { getColor } from '../../styles/colors';
import { styleReferenceBreaker } from '../../helpers';
import { getTextInputStyle } from '../BaseTextInputs';
import { Text } from '../Text';

export type ToggleProps = {
  /** Text to render */
  label: string;
  /** Helper text to render */
  helperText?: string;
  /** Indicate if toggled */
  toggled: boolean;
  /** Indicate if disabled */
  disabled?: boolean;
  /** Indicate if label should be hidden (label is used for accessibility even when hidden)  */
  hideLabel?: boolean;
  /** Selected label text (if not set will not show) */
  selectedLabelText?: {
    on: string;
    off: string;
  };
  /** onPress event returns the current value */
  onChange: (value: boolean) => void;
  /** Style to set on the item */
  style?: StyleProp<ViewStyle>;
  /** Style to set on the toggle wrapper itself */
  toggleWrapperStyle?: StyleProp<ViewStyle>;
  /** Direct props to set on the React Native component (including iOS and Android specific props). Most use cases should not need this. */
  componentProps?: SwitchProps;
};

/**
 * This component utilizes Native Switch from iOS and Android.
 * It is styled to be similar to Carbon.
 * But relies on the final styling from the OS.
 */
export class Toggle extends React.Component<ToggleProps> {
  private get styles() {
    return StyleSheet.create({
      wrapper: {
        paddingTop: 22,
      },
      switchWrapper: {
        flexDirection: 'row',
        paddingTop: 4,
      },
      selectedText: {
        marginLeft: 8,
        marginTop: 4,
      },
    });
  }

  private get textInputStyles() {
    return getTextInputStyle();
  }

  private get trackColor(): { false: string; true: string } {
    return {
      false: getColor('toggleOff'),
      true: getColor('supportSuccess'),
    };
  }

  private onChange = (value: boolean): void => {
    const { onChange } = this.props;

    if (typeof onChange === 'function') {
      onChange(value);
    }
  };

  render(): React.ReactNode {
    const { disabled, componentProps, hideLabel, label, helperText, style, selectedLabelText, toggled, toggleWrapperStyle } = this.props;

    return (
      <View style={styleReferenceBreaker(this.styles.wrapper, style)} accessible={true} accessibilityLabel={label} accessibilityHint={helperText}>
        {!!(label && !hideLabel) && <Text style={this.textInputStyles.label} type="label-02" text={label} />}
        <View style={styleReferenceBreaker(this.styles.switchWrapper, toggleWrapperStyle)}>
          <Switch value={toggled} onValueChange={this.onChange} disabled={disabled} trackColor={this.trackColor} thumbColor={getColor('iconOnColor')} {...(componentProps || {})} />
          {!!selectedLabelText && <Text style={this.styles.selectedText} text={toggled ? selectedLabelText.on : selectedLabelText.off} />}
        </View>
        {!!helperText && <Text style={this.textInputStyles.helperText} type="helper-text-02" text={helperText} />}
      </View>
    );
  }
}
