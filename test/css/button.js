describe('button', function () {
  $('a.nui-btn:eq(0), button.nui-btn:eq(0), input[type=button].nui-btn:eq(0), input[type=reset].nui-btn:eq(0), input[type=submit].nui-btn:eq(0)').each(function () {
    var $this = $(this);

    if (!$.browser.msie) {
      it('background-clip', function () {
        expect($this.css('background-clip')).to.be('padding-box');
      });
    }

    it('background-color', function () {
      expect($this.css('background-color')).to.match(/rgb\(238, 238, 238\)|#eee/);
    });

    it('background-image', function () {
      if ($.browser.mozilla) {
        expect($this.css('background-image')).to.be('-moz-linear-gradient(50% 0%, rgba(255, 255, 255, 0.2) 0%, transparent 50%, transparent 50%, rgba(0, 0, 0, 0.1) 100%)');
      } else if ($.browser.webkit) {
        expect($this.css('background-image')).to.be('-webkit-linear-gradient(top, rgba(255, 255, 255, 0.199219) 0%, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.0976563) 100%)');
      }
    });

    it('border-bottom-color', function () {
      expect($this.css('border-bottom-color')).to.match(/rgb\(153, 153, 153\)|#999/);
    });

    if (!$.browser.msie) {
      it('border-bottom-left-radius', function () {
        expect($this.css('border-bottom-left-radius')).to.be('4px');
      });
    }

    if (!$.browser.msie) {
      it('border-bottom-right-radius', function () {
        expect($this.css('border-bottom-right-radius')).to.be('4px');
      });
    }

    it('border-bottom-style', function () {
      expect($this.css('border-bottom-style')).to.be('solid');
    });

    it('border-bottom-width', function () {
      expect($this.css('border-bottom-width')).to.be('1px');
    });

    it('border-left-color', function () {
      expect($this.css('border-left-color')).to.match(/rgb\(153, 153, 153\)|#999/);
    });

    if (!$.browser.msie) {
      it('border-left-left-radius', function () {
        expect($this.css('border-bottom-left-radius')).to.be('4px');
      });

      it('border-left-right-radius', function () {
        expect($this.css('border-bottom-right-radius')).to.be('4px');
      });
    }

    it('border-left-style', function () {
      expect($this.css('border-bottom-style')).to.be('solid');
    });

    it('border-left-width', function () {
      expect($this.css('border-bottom-width')).to.be('1px');
    });

    it('border-right-color', function () {
      expect($this.css('border-bottom-color')).to.match(/rgb\(153, 153, 153\)|#999/);
    });

    if (!$.browser.msie) {
      it('border-right-left-radius', function () {
        expect($this.css('border-bottom-left-radius')).to.be('4px');
      });

      it('border-right-right-radius', function () {
        expect($this.css('border-bottom-right-radius')).to.be('4px');
      });
    }

    it('border-right-style', function () {
      expect($this.css('border-bottom-style')).to.be('solid');
    });

    it('border-right-width', function () {
      expect($this.css('border-bottom-width')).to.be('1px');
    });

    it('border-top-color', function () {
      expect($this.css('border-bottom-color')).to.match(/rgb\(153, 153, 153\)|#999/);
    });

    if (!$.browser.msie) {
      it('border-top-left-radius', function () {
        expect($this.css('border-bottom-left-radius')).to.be('4px');
      });

      it('border-top-right-radius', function () {
        expect($this.css('border-bottom-right-radius')).to.be('4px');
      });
    }

    it('border-top-style', function () {
      expect($this.css('border-bottom-style')).to.be('solid');
    });

    it('border-top-width', function () {
      expect($this.css('border-bottom-width')).to.be('1px');
    });

    it('box-sizing', function () {
      if ($.browser.mozilla) {
        expect($this.css('-moz-box-sizing')).to.be('border-box');
      } else {
        expect($this.css('box-sizing')).to.be('border-box');
      }
    });

    it('color', function () {
      expect($this.css('color')).to.match(/rgb\(0, 0, 0\)|#000/);
    });

    it('cursor', function () {
      expect($this.css('cursor')).to.be('pointer');
    });

    it('display', function () {
      expect($this.css('display')).to.be('inline-block');
    });

    it('font-size', function () {
      expect($this.css('font-size')).to.be('12px');
    });

    it('font-style', function () {
      expect($this.css('font-style')).to.be('normal');
    });

    it('font-variant', function () {
      expect($this.css('font-variant')).to.be('normal');
    });

    it('font-weight', function () {
      expect($this.css('font-weight')).to.match(/normal|400/);
    });

    it('height', function () {
      expect($this.css('height')).to.match(/14px|15px/);
    });

    it('letter-spacing', function () {
      expect($this.css('letter-spacing')).to.match(/normal|0px/);
    });

    it('line-height', function () {
      expect($this.css('line-height')).to.match(/normal|15px|15.3333px/);
    });

    it('margin-bottom', function () {
      expect($this.css('margin-bottom')).to.be('0px');
    });

    it('margin-left', function () {
      expect($this.css('margin-left')).to.be('0px');
    });

    it('margin-right', function () {
      expect($this.css('margin-right')).to.be('0px');
    });

    it('margin-top', function () {
      expect($this.css('margin-top')).to.be('0px');
    });

    it('overflow-x', function () {
      expect($this.css('overflow-x')).to.be('visible');
    });

    it('overflow-y', function () {
      expect($this.css('overflow-x')).to.be('visible');
    });

    it('padding-bottom', function () {
      expect($this.css('padding-bottom')).to.be('2px');
    });

    it('padding-left', function () {
      expect($this.css('padding-left')).to.be('8px');
    });

    it('padding-right', function () {
      expect($this.css('padding-right')).to.be('8px');
    });

    it('padding-top', function () {
      expect($this.css('padding-top')).to.be('2px');
    });

    it('text-align', function () {
      expect($this.css('text-align')).to.be('center');
    });

    it('text-indent', function () {
      expect($this.css('text-indent')).to.be('0px');
    });

    if (!$.browser.msie) {
      it('text-shadow', function () {
        expect($this.css('text-shadow')).to.match(/rgb\(255, 255, 255\) 0px 1px 0px|0px 1px 0px rgb\(255, 255, 255\)/);
      });
    }

    it('text-transform', function () {
      expect($this.css('text-transform')).to.be('none');
    });

    // Width can not be tested, because character width is inherited and not consitent across fonts.

    it('white-space', function () {
      expect($this.css('white-space')).to.be('nowrap');
    });

    it('word-spacing', function () {
      expect($this.css('word-spacing')).to.match(/normal|0px/);
    });
  });

  describe('select', function () {
    $('a.nui-btn.nui-slc:eq(0), button.nui-btn.nui-slc:eq(0)').each(function () {
      var $this = $(this);

      it('background-color', function () {
        expect($this.css('background-color')).to.match(/rgb\(0, 102, 204\)|#06c/);
      });

      it('background-image', function () {
        if ($.browser.webkit) {
          expect($this.css('background-image')).to.be('-webkit-linear-gradient(top, rgba(0, 0, 0, 0.296875) 0%, rgba(0, 0, 0, 0) 50%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.0976563) 100%)');
        }
      });

      it('border-bottom-color', function () {
        expect($this.css('border-bottom-color')).to.match(/rgb\(0, 102, 204\)|#06c/);
      });

      it('border-left-color', function () {
        expect($this.css('border-left-color')).to.match(/rgb\(0, 102, 204\)|#06c/);
      });

      it('border-right-color', function () {
        expect($this.css('border-right-color')).to.match(/rgb\(0, 102, 204\)|#06c/);
      });

      it('border-top-color', function () {
        expect($this.css('border-top-color')).to.match(/rgb\(0, 102, 204\)|#06c/);
      });

      it('color', function () {
        expect($this.css('color')).to.match(/rgb\(255, 255, 255\)|#fff/);
      });

      if (!$.browser.msie) {
        it('text-shadow', function () {
          expect($this.css('text-shadow')).to.match(/rgb\(0, 102, 204\) 0px -1px 1px|0px -1px 1px rgb\(0, 102, 204\)/);
        });
      }
    });
  });


  describe('disable', function () {
    $('a.nui-btn.nui-dsb:eq(0), button.nui-btn.nui-dsb:eq(0)').each(function () {
      var $this = $(this);

      it('color', function () {
        expect($this.css('color')).to.match(/rgb\(0, 0, 0\)|#000/);
      });

      it('cursor', function () {
        expect($this.css('cursor')).to.be('default');
      });

      it('opacity', function () {
        expect($this.css('opacity')).to.be('0.5');
      });
    });
  });

  describe('select + disable', function () {
    $('a.nui-btn.nui-slc.nui-dsb:eq(0), button.nui-slc.nui-btn.nui-dsb:eq(0)').each(function () {
      var $this = $(this);

      it('background-color', function () {
        expect($this.css('background-color')).to.match(/rgb\(0, 102, 204\)|#06c/);
      });

      it('background-image', function () {
        if ($.browser.webkit) {
          expect($this.css('background-image')).to.be('-webkit-linear-gradient(top, rgba(0, 0, 0, 0.296875) 0%, rgba(0, 0, 0, 0) 50%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.0976563) 100%)');
        }
      });

      it('border-bottom-color', function () {
        expect($this.css('border-bottom-color')).to.match(/rgb\(0, 102, 204\)|#06c/);
      });

      it('border-left-color', function () {
        expect($this.css('border-left-color')).to.match(/rgb\(0, 102, 204\)|#06c/);
      });

      it('border-right-color', function () {
        expect($this.css('border-right-color')).to.match(/rgb\(0, 102, 204\)|#06c/);
      });

      it('border-top-color', function () {
        expect($this.css('border-top-color')).to.match(/rgb\(0, 102, 204\)|#06c/);
      });

      it('color', function () {
        expect($this.css('color')).to.match(/rgb\(255, 255, 255\)|#fff/);
      });

      it('cursor', function () {
        expect($this.css('cursor')).to.be('default');
      });

      if (!$.browser.msie) {
        it('text-shadow', function () {
          expect($this.css('text-shadow')).to.match(/rgb\(0, 102, 204\) 0px -1px 1px|0px -1px 1px rgb\(0, 102, 204\)/);
        });
      }
    });
  });
});
