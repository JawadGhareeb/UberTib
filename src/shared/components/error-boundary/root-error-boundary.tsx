import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

type Props = { children: ReactNode };
type State = { error: Error | null };

/**
 * Native-style fallback: remains visible even when styling utilities fail.
 */
export class RootErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[UberTib startup] React render failed', error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#F9F9F9',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          gap: 16,
        }}
      >
        <Text
          accessibilityRole="header"
          style={{
            fontSize: 22,
            fontWeight: '700',
            color: '#111111',
            textAlign: 'center',
          }}
        >
          تعذّر فتح التطبيق
        </Text>
        <Text style={{ fontSize: 15, color: '#444444', textAlign: 'center' }}>
          واجه التطبيق مشكلة أثناء بدء التشغيل. جرّب إعادة المحاولة.
        </Text>
        {__DEV__ ? (
          <Text selectable style={{ color: '#B42318', fontSize: 12, textAlign: 'left' }}>
            {error.message}
          </Text>
        ) : null}
        <Pressable
          accessibilityRole="button"
          onPress={() => this.setState({ error: null })}
          style={{
            minHeight: 48,
            borderRadius: 12,
            backgroundColor: '#111111',
            paddingHorizontal: 24,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>إعادة المحاولة</Text>
        </Pressable>
      </View>
    );
  }
}
