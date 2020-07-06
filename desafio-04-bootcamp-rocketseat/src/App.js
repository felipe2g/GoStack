import React, { useEffect, useState } from "react";

import api from './services/api';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {

  const [repositories, setRepositories] = useState([]);

  useEffect(()=>{
    api.get('repositories').then(response => {
      setRepositories(response.data);
    })
  }, []);

  async function handleLikeRepository(id) {
    await api.post(`repositories/${id}/like`).then(response => {

      const indexRepo = repositories.findIndex(r => r.id === id);

      let newRepo = Array.from(repositories);

      newRepo[indexRepo].likes = response.data.likes;

      setRepositories(newRepo);

    })
  }

  async function handleDeleteRepository(id) {
    await api.delete(`repositories/${id}`).then(response => {

      const indexRepo = repositories.findIndex(r => r.id === id);

      let newRepo = repositories.filter(repository => repository.id !== id);

      setRepositories(newRepo);

    })
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={repository => repository.id}
          style={styles.repositoryContainer}
          renderItem={({ item: repository}) => (
            <>
              <Text style={styles.repository}>{repository.title}</Text>
              <TouchableOpacity 
              style={styles.buttonDelete}
              onPress={() => handleDeleteRepository(repository.id)}
              >
                <Text style={styles.textDelete}>Deletar</Text>
              </TouchableOpacity>

              <View style={styles.techsContainer}>
                {repository.techs.map(item => <Text style={styles.tech} key={item}>{item}</Text>)}
              </View> 

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  key={repository.id}
                  testID={`repository-likes-${repository.id}`}
                >
                  {repository.likes}{(repository.likes > 1)? ` curtidas` : ` curtida`}
                </Text>
              </View>

              <TouchableOpacity
              style={styles.button}
              onPress={() => handleLikeRepository(repository.id)}
              testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
  buttonDelete: {
    backgroundColor: 'red',
    width: 50,
    height: 25,
  },
  textDelete: {
    color: "#fff",
    fontSize: 12,
    justifyContent: "center",
    marginLeft: 5,
    marginTop: 3,
    fontWeight: "bold"
  }
});
