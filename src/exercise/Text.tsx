import React from 'react'
import { StyleSheet, Text } from 'react-native'

interface MTextProps {
  size: number;
  color: string;
  family: string;
  children: React.ReactChildren | string | React.ReactChild;
  weight: string;
  align: string;
  style: object;
  padding: number;
  margin: number;
  marginHorizontal: number;
  marginVertical: number;
  paddingHorizontal: number;
  paddingVertical: number;
  marginBottom: number;
  marginTop: number;
  isBold: boolean,
}
// reused component
export default function MText({
  size, color = '#222',
  family, children,
  weight, align, marginHorizontal,
  marginVertical, style,
  paddingHorizontal,
  paddingVertical,
  padding, margin,
  marginBottom,
  marginTop,
  isBold,
}: MTextProps) {
  return (
    <Text style={[{
      fontSize: size,
      color,
      fontFamily: family,
      fontWeight: isBold ? 'bold' : weight,
      textAlign: align,
      marginVertical,
      marginHorizontal,
      paddingHorizontal,
      paddingVertical,
      margin,
      padding,
      marginTop,
      marginBottom,
    }, style]}>{children}</Text>
  )
}

const styles = StyleSheet.create({
})
