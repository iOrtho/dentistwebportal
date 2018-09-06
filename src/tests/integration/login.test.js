import React from 'react';
import { mount } from 'enzyme';
import {reducer as myReducer} from '../../store/store';
import Login from '../../pages/Auth/Login';
import setupIntegrationTest from '../testSetup';

//jest.mock('firebase', () => require('firebase/firebase-browser'));

describe('Tests on the Login page', () => {
    let store;
    let dispatchSpy;

    beforeEach(() => {

        ({store, dispatchSpy} = setupIntegrationTest({ myReducer }));
    });

    it('should render', () => {
        const div = mount(<Login />);

        console.log(div)
        expect(1).toEqual(1)
    });
});