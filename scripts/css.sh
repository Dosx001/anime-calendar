#!/bin/bash
clear
sass css/styles.scss > css/styles.css
yui-compressor css/styles.css > css/styles.min.css
