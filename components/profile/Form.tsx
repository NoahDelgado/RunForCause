import { ErrorMessage } from '@hookform/error-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as React from 'react';
import { useContext, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { DIMENSIONS } from '../../app/styles/dimensions'

import { config } from "../../config";
import { UserContext } from '../../contexts/userContext';
import ImagePicker from './ImagePicker';

export default (props) => {
    const { register, setValue, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            picture: '',
            name: '',
            email: '',
            phone: '',
        }
    });

    const onSubmit = async (data) => {
        console.log(data);
        let authToken = await AsyncStorage.getItem('auth-token');
        setUser((prev) => ({
            ...prev,
            picture: data.picture,
            name: data.name,
            email: data.email,
            phone: data.phone,

        }));

        axios.post(config.api_url + "/me", {
            '_method': 'PATCH',
            'name': data.name,
            'email': data.email,
            'phone': data.phone,
        }, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Authorization": "Bearer " + authToken,
            }
        }).then(async (response) => {
            props.navigation.goBack();
        }).catch(err => {
            console.log(err);
        });
    };

    const { user, setUser } = useContext(UserContext);

    function handleRefresh() {
        reset({
            email: user.email,
            name: user.name,
            phone: user.phone,
            picture: user.picture,
        })

    }

    useEffect(() => {
        handleRefresh();
    }, []);

    return (
        <View style={styles.container}>
            <ImagePicker style={styles.avatar} source={`${config.img_url}/${user.picture}`} />

            <View>
                <Text style={styles.label}>Full name</Text>
                <ErrorMessage errors={errors} name="name" message="This is required"
                    render={({ message }) => (
                        <View style={styles.error}>
                            <Text style={styles.errorText}>{message}</Text>
                        </View>
                    )}
                />
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                        />
                    )}
                    name="name"
                    rules={{ required: true }}
                />

                <Text style={styles.label}>Email</Text>
                <ErrorMessage errors={errors} name="email" message="This is required"
                    render={({ message }) => (
                        <View style={styles.error}>
                            <Text style={styles.errorText}>{message}</Text>
                        </View>
                    )}
                />
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                        />
                    )}
                    name="email"
                    rules={{ required: true }}
                />

                <Text style={styles.label}>Phone</Text>
                <ErrorMessage errors={errors} name="phone" message="This is required"
                    render={({ message }) => (
                        <View style={styles.error}>
                            <Text style={styles.errorText}>{message}</Text>
                        </View>
                    )}
                />
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                        />
                    )}
                    name="phone"
                    rules={{ required: true }}
                />


                <View style={styles.button}>
                    <Button
                        style={styles.buttonInner}
                        color
                        title="Save"
                        onPress={handleSubmit(onSubmit)}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        marginTop: 20,
        marginLeft: 5,
    },
    avatarContainer: {
        flex: 1,
        textAlign: 'center',

    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: 10,
    },
    button: {
        marginTop: 20,
        color: 'white',
        height: 40,
        backgroundColor: '#e15638',
        borderRadius: DIMENSIONS.inputBorderRadius,
        marginLeft: 5,
        marginRight: 5,
    },
    container: {
        flex: 1,
        padding: 8,
    },
    input: {
        padding: 5,
        borderRadius: DIMENSIONS.inputBorderRadius,
        height: DIMENSIONS.height,
        marginTop: 5,
        marginRight: 5,
        marginLeft: 5,
        // margin: DIMENSIONS.margin,
        backgroundColor: '#fff',
    },
    multiline: {
        height: DIMENSIONS.height + 20,
        textAlignVertical: 'top',
    },
    error: {
        backgroundColor: '#ffb0b7',
        width: '100%',
        height: 20,
        borderRadius: DIMENSIONS.inputBorderRadius,
        justifyContent: 'center',
        padding: 5,
        marginLeft: 5,
        marginRight: 5
    },
    errorText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
