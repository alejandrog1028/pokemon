import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image, ScrollView } from 'react-native';

export default function App() {
  const [name, setName] = useState('shuppet'); // Default Pokémon
  const [result, setResult] = useState('');
  const [images, setImages] = useState([]);

  // ✅ Replace this with YOUR computer's IP address and port 3000
  const API_URL = 'http://10.28.166.136:3000';

  useEffect(() => {
    const fetchData = async () => {
      setResult('Loading...');
      setImages([]);

      try {
        const [typeRes, imageRes] = await Promise.all([
          fetch(`${API_URL}/get-pokemon-type?name=${encodeURIComponent(name)}`),
          fetch(`${API_URL}/get-pokemon-image?name=${encodeURIComponent(name)}`)
        ]);

        const typeData = await typeRes.json();
        const imageData = await imageRes.json();

        if (typeData.types) {
          setResult(`${typeData.name.toUpperCase()} type(s): ${typeData.types.join(', ')}`);
        } else {
          setResult(typeData.error || 'Error fetching type.');
        }

        if (imageData.images && imageData.images.length) {
          setImages(imageData.images);
        } else {
          setImages([]);
        }

      } catch (error) {
        setResult('Failed to fetch data.');
        setImages([]);
        console.error(error);
      }
    };

    fetchData();
  }, [name]);

  return (
    <View style={styles.container}>
      <View style={styles.phoneFrame}>
        <Text style={styles.title}>🔍 Pokédex</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={text => setName(text.toLowerCase())}
          placeholder="Enter Pokémon name"
          autoCapitalize="none"
        />
        <ScrollView contentContainerStyle={styles.imagesColumn}>
          {images.map((img, idx) => (
            <Image key={idx} source={{ uri: img }} style={styles.image} />
          ))}
        </ScrollView>
        <Text style={styles.result}>{result}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  phoneFrame: {
    width: 340,
    height: 700,
    backgroundColor: '#fff',
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#222',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: 200,
    marginBottom: 10,
  },
  imagesColumn: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    marginBottom: 10,
  },
  result: {
    fontSize: 18,
    marginBottom: 10,
    minHeight: 30,
    textAlign: 'center',
    width: '100%',
  },
  image: {
    width: 120,
    height: 120,
    margin: 5,
    resizeMode: 'contain',
  },
});
