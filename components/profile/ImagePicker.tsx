import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Camera } from "expo-camera";
import FormData from 'form-data';
import React, { useEffect, useState, useContext } from "react";
import {
    Image, Modal,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { Button } from "react-native-paper";
import { config } from "../../config";
import { UserContext } from '../../contexts/userContext.ts';

const CameraModule = (props) => {
    const [cameraRef, setCameraRef] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    let { user, setUser } = useContext(UserContext);

    async function uploadPhoto() {
        if (cameraRef) {
            let photo = await cameraRef.takePictureAsync();
            let authToken = await AsyncStorage.getItem('auth-token');
            let data = new FormData();

            props.setImage(photo);
            props.setModalVisible();

            data.append('photo', {
                uri: photo.uri,
                name: 'photo',
                type: 'image/jpeg',
            });

            axios.post(`${config.api_url}/me/photo`, data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'multipart/form-data',
                    'Authorization': `Bearer ${authToken}`,
                },
            }).then(async (response) => {
                console.log(response);
            }).catch(err => {
                console.log(err);
            });
        }

    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={() => {
                props.setModalVisible();
            }}
        >
            <Camera
                style={{ flex: 1 }}
                ratio="16:9"
                flashMode={Camera.Constants.FlashMode.on}
                type={type}
                ref={(ref) => {
                    setCameraRef(ref);
                }}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "transparent",
                        justifyContent: "flex-end",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "black",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Button
                            icon="close"
                            style={{ marginLeft: 12 }}
                            mode="outlined"
                            color="white"
                            onPress={() => {
                                props.setModalVisible();
                            }}
                        >
                            Close
                        </Button>
                        <TouchableOpacity onPress={uploadPhoto}>
                            <View
                                style={{
                                    borderWidth: 2,
                                    borderRadius: 50,
                                    borderColor: "white",
                                    height: 50,
                                    width: 50,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginBottom: 16,
                                    marginTop: 16,
                                }}
                            >
                                <View
                                    style={{
                                        borderWidth: 2,
                                        borderRadius: 50,
                                        borderColor: "white",
                                        height: 40,
                                        width: 40,
                                        backgroundColor: "white",
                                    }}
                                ></View>
                            </View>
                        </TouchableOpacity>
                        <Button
                            icon="axis-z-rotate-clockwise"
                            style={{ marginRight: 12 }}
                            mode="outlined"
                            color="white"
                            onPress={() => {
                                setType(
                                    type === Camera.Constants.Type.back
                                        ? Camera.Constants.Type.front
                                        : Camera.Constants.Type.back
                                );
                            }}
                        >
                            {type === Camera.Constants.Type.back ? "Front" : "Back "}
                        </Button>
                    </View>
                </View>
            </Camera>
        </Modal>
    );
};

export default function ImagePicker(props) {

    const [image, setImage] = useState(props.source);
    const [camera, setShowCamera] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <View
                style={{
                    backgroundColor: "#eeee",
                    width: 120,
                    height: 120,
                    borderRadius: 100,
                    marginBottom: 8,
                }}
            >
                <Image
                    source={{ uri: image }}
                    style={props.style}
                />
            </View>
            <Button
                style={{ width: "30%", marginTop: 16 }}
                icon="camera"
                mode="contained"
                onPress={() => {
                    setShowCamera(true);
                }}
            >
                Camera
            </Button>
            {camera && (
                <CameraModule
                    showModal={camera}
                    setModalVisible={() => setShowCamera(false)}
                    setImage={(result) => setImage(result.uri)}
                />
            )}
        </View>
    );
}