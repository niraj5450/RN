import React, { useState, useCallback, useEffect } from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MText from './Text';
import firestore from '@react-native-firebase/firestore';

interface WordProps {
  word: string;
  onPress: () => void;
  isSelected: string;
  status: string;
  disabled: boolean;
}

const Word = ({ word, onPress, isSelected, status, disabled = false }: WordProps) => {
  return (
    <TouchableOpacity onPress={onPress}
      disabled={disabled}
      style={[styles.word, {
        backgroundColor: status === 'matched' ? 'skyblue' : status === 'unmatched' ? '#f45' :
          isSelected === word ? '#fff3' : 'white',
        elevation: isSelected === word ? 0 : 8,
      }]}>
      <MText size={16}
        color={status !== '' && isSelected === word ? 'white' : '#333'}
        isBold style={{ textTransform: 'capitalize' }}>{word}</MText>
    </TouchableOpacity>
  )
}
export default function index() {
  const [selectedWord, setSelectedWord] = useState('');
  const [exerciseList, setExerciseList] = useState([]);
  const [curIndex, setCurIndex] = useState(0);
  const [status, setStatus] = useState('')//match | unmatched

  const getExercise = useCallback(async () => {
    await firestore()
      .collection('exercise').get()
      .then(res => {
        const data = [];
        res.forEach(element => {
          // console.log('exercise: ', element.id, element.data());
          data.push(element.data())
        });
        setExerciseList(data.reverse());
      });
  })
  const exercise = exerciseList && exerciseList[curIndex]
  // console.log(exercise);
  const words = exercise && exercise.words
  const englishSent = exercise && exercise.english
  const germanSent = exercise && exercise.german
  const checkWordMatch = () => {
    const word = exercise && exercise.word;
    if (word === selectedWord) {
      setStatus('matched')
    } else {
      setStatus('unmatched')
    }
  }

  useEffect(() => {
    const unsubscribe = getExercise();
    return () => unsubscribe;
  }, [])
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'skyblue'} />
      <View style={styles.topContainer} />
      <View style={styles.bottomContainer}>
        <MText size={16} color='white'>Fill in the messing word</MText>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {englishSent && englishSent.map((_, i) => {
            return (
              <MText size={30} color='white' key={i} isBold={_.highlight}
                style={{ textDecorationLine: _.highlight ? 'underline' : null }}>
                {_.word}</MText>
            )
          })}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 28 }}>
          {germanSent && germanSent.map((_, i) => {
            return (
              <>
                {_.word === '0' && selectedWord !== '' ? <Word word={selectedWord} status={status} /> :
                  <MText size={24} color='white' key={i}>
                    {_.word === '0' ? '____' : _.word}{' '}</MText>}
              </>
            )
          })}
        </View>
        <View style={styles.words}>
          {words && words.map((_, i) => (
            <Word key={i} word={_}
              isSelected={selectedWord}
              disabled={status !== ''}
              onPress={() => setSelectedWord(_)}
            />))}
        </View>
        {selectedWord !== '' && status !== '' ? (
          <View style={[styles.popup, { backgroundColor: status === 'matched' ? 'skyblue' : '#f45' }]}>
            <View style={{ width: '100%' }}>
              <MText marginHorizontal={24} color='white'>{status === 'matched' ? 'Great Job!' : `Answer: ${exercise.word}`}</MText>
            </View>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: 'white', elevation: 8 }]}
              disabled={exerciseList.length - 1 == curIndex}
              onPress={() => {
                setCurIndex(prev => prev + 1)
                setStatus('')
                setSelectedWord('')
              }}>
              <MText isBold size={18} color={status === 'matched' ? 'skyblue' : '#f45'}>Continue</MText>
            </TouchableOpacity>
          </View>
        ) : (<TouchableOpacity
          style={[styles.btn, { backgroundColor: selectedWord !== '' ? 'skyblue' : '#fff4' }]}
          disabled={selectedWord === ''}
          onPress={checkWordMatch}>
          <MText
            isBold
            size={18}
            color='white'>{selectedWord === '' ? 'Continue' : 'Check Answer'}</MText>
        </TouchableOpacity>)}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'skyblue',
  },
  topContainer: {
    height: 120,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: '#537da1',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  word: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    marginVertical: 8,
    shadowOffset: { width: 2, height: 1 },
    shadowColor: '#123',
    shadowOpacity: .6,
  },
  words: {
    paddingVertical: 40,
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: Dimensions.get('window').width / 1.5,
    justifyContent: 'center',
  },
  btn: {
    height: 60,
    width: '80%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    backgroundColor: '#fff4',
  },
  popup: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 140,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'skyblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
