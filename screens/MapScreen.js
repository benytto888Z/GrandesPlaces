import React,{useState,useEffect,useCallback,useLayoutEffect} from 'react';
import {Text,StyleSheet,Platform,Alert} from 'react-native';
import MapView , { PROVIDER_GOOGLE,Marker } from 'react-native-maps';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from 'react-native/Libraries/NewAppScreen';


//---------//----------------------------------------------------------


function MapScreen({navigation,route}) {

const [selectedLocation,setSelectedLocation] = useState();

//--------------------------------
  const mapRegion = {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
  };

  //--------------------------------


  const selectLocationHandler = event =>{
      setSelectedLocation({
          lat:event.nativeEvent.coordinate.latitude,
          lng:event.nativeEvent.coordinate.longitude
      });
    
  }
  
  //--------------------------------

  const savePickedLocationHandler = useCallback(() =>{

    if(!selectedLocation){
      Alert.alert('Aucune sélection','Veuillez choisir un lieu',[
        {text:'Ok'}
      ])
      return;
    }

    navigation.navigate('NewPlace',{pickedLocation:selectedLocation});
       
  },[selectedLocation]);
  //--------------------------------

  useEffect(()=>{
    navigation.setParams({
        saveLocation:savePickedLocationHandler
    })
  },[savePickedLocationHandler])
  
  //--------------------------------

  let markerCoordinates;

  if(selectedLocation){
    markerCoordinates = {
      latitude:selectedLocation.lat,
      longitude:selectedLocation.lng
    }
  }

  //--------------------------------

  return (
    <MapView 
    provider= {Platform.OS === 'android' ? PROVIDER_GOOGLE : null}
    style={styles.map} 
    region={mapRegion}
    onPress={selectLocationHandler}
    >
    {markerCoordinates && <Marker 
    title='Choisir un emplacement'
    coordinate={markerCoordinates}
    >
    
    </Marker>}
    </MapView>
  );
}

//----------------------------

export const screenOptions = navData => {
  const routeParams = navData.route.params ? navData.route.params : {};
  const saveFn = routeParams.saveLocation ? routeParams.saveLocation : null;

  return {
    headerTitle: 'Carte',
    headerRight: () => (
      <TouchableOpacity style={styles.headerButton} onPress={saveFn}>
      <Text style={styles.headerButtonText}>Enregistrer</Text>
      </TouchableOpacity>
    ),
  }
}
//---------------//-----------------


const styles = StyleSheet.create({
  map:{
    flex:1,
  },
  headerButton:{
    marginHorizontal:20
  },
  headerButtonText:{
    fontSize:16,
    color:Platform.OS === 'android' ? 'white' : Colors.primary
  }
});

export default MapScreen;