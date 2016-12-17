/**
 * Created by Mosh Mage on 12/17/2016.
 */

import {IO} from './socket-io';

describe('IO', () => {
    const _IO = new IO();

    it('created a proper IO class', () => {
        expect(_IO instanceof IO).toBeTruthy();
    });
});