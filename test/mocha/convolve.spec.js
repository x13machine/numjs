'use strict';

/* jshint ignore:start */
var expect = require('expect.js');
/* jshint ignore:end */
var _ = require('lodash');
var nj = require('../../src');

describe('convolve', function () {
    it('should work on vectors', function () {
        var x = nj.float32([0,0,1,2,1,0,0]),
            filter = [-1,0,1],
            conv = nj.convolve(x, filter);
        expect(conv.round().tolist())
            .to.eql([-1, -2,  0,  2,  1]);
        expect(conv.dtype).to.be('float32');
    });

    it('should work with 3x3 filter', function () {
        var x = nj.arange(5*5).reshape(5,5),
            filter = nj.arange(9).reshape(3,3);
        expect(x.convolve(filter).round().tolist())
            .to.eql([
                [120, 156, 192],
                [300, 336, 372],
                [480, 516, 552]]);
    });

    it('should work with 2x3 filter', function () {
        var x = nj.arange(5*5).reshape(5,5),
            filter = nj.arange(6).reshape(2,3);
        expect(x.convolve(filter).round().tolist())
            .to.eql([
                [ 26,  41,  56],
                [101, 116, 131],
                [176, 191, 206],
                [251, 266, 281]]);
    });

    it('should work with 3x2 filter', function () {
        var x = nj.arange(5*5).reshape(5,5),
            filter = nj.arange(6).reshape(3,2);
        expect(x.convolve(filter).round().tolist())
            .to.eql([
                [ 41,  56,  71,  86],
                [116, 131, 146, 161],
                [191, 206, 221, 236]]);
    });

    it('should work with 3x3x1 filter', function () {
        var x = nj.arange(5*5).reshape(5,5,1),
            filter = nj.arange(9).reshape(3,3,1),
            c = x.convolve(filter);
        expect(c.shape).to.eql([5-3+1, 5-3+1, 1]);
        expect(c.tolist())
            .to.eql(nj.array([
                [120, 156, 192],
                [300, 336, 372],
                [480, 516, 552]]).reshape(3,3,1).tolist());
    });

    it('should work with 5x5 filter', function () {
        var x = nj.arange(25).reshape(5,5),
            filter = nj.arange(25).reshape(5,5);
        expect(x.convolve(filter).tolist())
            .to.eql([[2300]]);
    });

    it('should work with 5x5x1 filter', function () {
        var x = nj.arange(25).reshape(5,5,1),
            filter = nj.arange(25).reshape(5,5,1),
            c = x.convolve(filter);
        expect(c.shape).to.eql([1, 1, 1]);
        expect(c.tolist())
            .to.eql([[[2300]]]);
    });

    it('should be fast with 3x3 filter even if X is large', function () {
        this.timeout(300);
        var N = 1000,
            x = nj.arange(N*N).reshape(N,N),
            filter = nj.arange(9).reshape(3,3);
        x.convolve(filter);
    });

    it('should be fast with 3x3x1 filter even if X is large', function () {
        this.timeout(300);
        var N = 1000,
            x = nj.arange(N*N).reshape(N,N,1),
            filter = nj.arange(9).reshape(3,3,1);
        x.convolve(filter);
    });

    it('should be fast with 5x5 filter even if X is large', function () {
        this.timeout(300);
        var N = 1000,
            x = nj.arange(N*N).reshape(N,N),
            filter = nj.arange(25).reshape(5,5);
        x.convolve(filter);
    });

    it('should be fast with 5x5x1 filter even if X is large', function () {
        this.timeout(300);
        var N = 1000,
            x = nj.arange(N*N).reshape(N,N,1),
            filter = nj.arange(25).reshape(5,5,1);
        x.convolve(filter);
    });
});

describe('fftconvolve', function () {
    it('should work on vectors', function () {
        var x = nj.float32([0,0,1,2,1,0,0]),
            filter = [-1,0,1],
            conv = nj.fftconvolve(x, filter);
        expect(conv.round().tolist())
            .to.eql([-1, -2,  0,  2,  1]);
        expect(conv.dtype).to.be('float32');
    });

    it('should work with 3x3 filter', function () {
        var x = nj.arange(5*5).reshape(5,5),
            filter = nj.arange(9).reshape(3,3);
        expect(x.fftconvolve(filter).round().tolist())
            .to.eql([
                [120, 156, 192],
                [300, 336, 372],
                [480, 516, 552]]);
    });
});