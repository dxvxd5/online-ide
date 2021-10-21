import React from 'react';
import {
  SiTypescript,
  SiJavascript,
  SiCplusplus,
  SiCsharp,
  SiHtml5,
  SiCoursera,
  SiGo,
  SiJson,
  SiDocker,
  SiApachegroovy,
  SiPhp,
  SiLess,
  SiSass,
  SiRuby,
  SiRust,
  SiSwift,
  SiPug,
  SiPerl,
  SiMarkdown,
  SiLua,
  SiHandlebarsdotjs,
  SiCoffeescript,
  SiClojure,
  SiGit,
  SiPowershell,
  SiVisualstudio,
  SiMysql,
  SiReact,
  SiLatex,
  SiCss3,
} from 'react-icons/si';

import { AiFillFile } from 'react-icons/ai';
import {
  extToLanguage,
  getFileLanguage,
} from '../../../../utils/file-extension';

export default function LanguageIcon(fileName: string): JSX.Element {
  const fileLanguage = getFileLanguage(fileName);
  switch (fileLanguage) {
    case extToLanguage.cpp:
      return <SiCplusplus color="#1f69a3" />;
    case extToLanguage.cs:
      return <SiCsharp color="#652076" />;
    case extToLanguage.css:
      return <SiCss3 color="#156db0" />;
    case extToLanguage.html:
      return <SiHtml5 color="#dd4b25" />;
    case extToLanguage.ts:
      return <SiTypescript color="#2f78c7" />;
    case extToLanguage.js:
      return <SiJavascript color="#f7e017" />;
    case extToLanguage.c:
      return <SiCoursera color="#28348f" />;
    case extToLanguage.go:
      return <SiGo color="#09a7d0" />;
    case extToLanguage.json:
    case extToLanguage.jsonc:
      return <SiJson color="#121212" />;
    case extToLanguage.latex:
      return <SiLatex color="#007c7c" />;
    case extToLanguage.dockerfile:
      return <SiDocker color="#2392e5" />;
    case extToLanguage.groovy:
      return <SiApachegroovy color="#5e97b6" />;
    case extToLanguage.php:
      return <SiPhp color="#7477ae" />;
    case extToLanguage.less:
      return <SiLess color="#1d365c" />;
    case extToLanguage.sass:
    case extToLanguage.scss:
      return <SiSass color="#c76495" />;
    case extToLanguage.rb:
      return <SiRuby color="#ad1202" />;
    case extToLanguage.rs:
      return <SiRust />;
    case extToLanguage.swift:
      return <SiSwift color="#f24025" />;
    case extToLanguage.pug:
      return <SiPug color="#52312a" />;
    case extToLanguage.pl:
      return <SiPerl color="#4b5b80" />;
    case extToLanguage.md:
      return <SiMarkdown />;
    case extToLanguage.lua:
      return <SiLua color="#06007c" />;
    case extToLanguage.hbs:
      return <SiHandlebarsdotjs color="#352616" />;
    case extToLanguage.coffee:
      return <SiCoffeescript color="#27324a" />;
    case extToLanguage.clj:
      return <SiClojure />;
    case extToLanguage['git-commit']:
    case extToLanguage['git-rebase']:
    case extToLanguage.git:
      return <SiGit color="#f05033" />;
    case extToLanguage.ps1:
      return <SiPowershell color="#4478d0" />;
    case extToLanguage.vb:
      return <SiVisualstudio color="#641e75" />;

    case extToLanguage.py:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="1em"
          height="1em"
        >
          <path
            fill="#0277BD"
            d="M24.047,5c-1.555,0.005-2.633,0.142-3.936,0.367c-3.848,0.67-4.549,2.077-4.549,4.67V14h9v2H15.22h-4.35c-2.636,0-4.943,1.242-5.674,4.219c-0.826,3.417-0.863,5.557,0,9.125C5.851,32.005,7.294,34,9.931,34h3.632v-5.104c0-2.966,2.686-5.896,5.764-5.896h7.236c2.523,0,5-1.862,5-4.377v-8.586c0-2.439-1.759-4.263-4.218-4.672C27.406,5.359,25.589,4.994,24.047,5z M19.063,9c0.821,0,1.5,0.677,1.5,1.502c0,0.833-0.679,1.498-1.5,1.498c-0.837,0-1.5-0.664-1.5-1.498C17.563,9.68,18.226,9,19.063,9z"
          />
          <path
            fill="#FFC107"
            d="M23.078,43c1.555-0.005,2.633-0.142,3.936-0.367c3.848-0.67,4.549-2.077,4.549-4.67V34h-9v-2h9.343h4.35c2.636,0,4.943-1.242,5.674-4.219c0.826-3.417,0.863-5.557,0-9.125C41.274,15.995,39.831,14,37.194,14h-3.632v5.104c0,2.966-2.686,5.896-5.764,5.896h-7.236c-2.523,0-5,1.862-5,4.377v8.586c0,2.439,1.759,4.263,4.218,4.672C19.719,42.641,21.536,43.006,23.078,43z M28.063,39c-0.821,0-1.5-0.677-1.5-1.502c0-0.833,0.679-1.498,1.5-1.498c0.837,0,1.5,0.664,1.5,1.498C29.563,38.32,28.899,39,28.063,39z"
          />
        </svg>
      );
    case extToLanguage.java:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="1em"
          height="1em"
        >
          <path
            fill="#F44336"
            d="M23.65,24.898c-0.998-1.609-1.722-2.943-2.725-5.455C19.229,15.2,31.24,11.366,26.37,3.999c2.111,5.089-7.577,8.235-8.477,12.473C17.07,20.37,23.645,24.898,23.65,24.898z"
          />
          <path
            fill="#F44336"
            d="M23.878,17.27c-0.192,2.516,2.229,3.857,2.299,5.695c0.056,1.496-1.447,2.743-1.447,2.743s2.728-0.536,3.579-2.818c0.945-2.534-1.834-4.269-1.548-6.298c0.267-1.938,6.031-5.543,6.031-5.543S24.311,11.611,23.878,17.27z"
          />
          <g>
            <path
              fill="#1565C0"
              d="M32.084 25.055c1.754-.394 3.233.723 3.233 2.01 0 2.901-4.021 5.643-4.021 5.643s6.225-.742 6.225-5.505C37.521 24.053 34.464 23.266 32.084 25.055zM29.129 27.395c0 0 1.941-1.383 2.458-1.902-4.763 1.011-15.638 1.147-15.638.269 0-.809 3.507-1.638 3.507-1.638s-7.773-.112-7.773 2.181C11.683 28.695 21.858 28.866 29.129 27.395z"
            />
            <path
              fill="#1565C0"
              d="M27.935,29.571c-4.509,1.499-12.814,1.02-10.354-0.993c-1.198,0-2.974,0.963-2.974,1.889c0,1.857,8.982,3.291,15.63,0.572L27.935,29.571z"
            />
            <path
              fill="#1565C0"
              d="M18.686,32.739c-1.636,0-2.695,1.054-2.695,1.822c0,2.391,9.76,2.632,13.627,0.205l-2.458-1.632C24.271,34.404,17.014,34.579,18.686,32.739z"
            />
            <path
              fill="#1565C0"
              d="M36.281,36.632c0-0.936-1.055-1.377-1.433-1.588c2.228,5.373-22.317,4.956-22.317,1.784c0-0.721,1.807-1.427,3.477-1.093l-1.42-0.839C11.26,34.374,9,35.837,9,37.017C9,42.52,36.281,42.255,36.281,36.632z"
            />
            <path
              fill="#1565C0"
              d="M39,38.604c-4.146,4.095-14.659,5.587-25.231,3.057C24.341,46.164,38.95,43.628,39,38.604z"
            />
          </g>
        </svg>
      );
    case extToLanguage.jsx:
    case extToLanguage.tsx:
      return <SiReact color="#5fd3f2" />;
    case extToLanguage.bib:
    case extToLanguage.tex:
      return <SiLatex color="green" />;
    case extToLanguage.sql:
      return <SiMysql color="#3C99DC" />;
    case extToLanguage.cshtml:
      return <SiCss3 color="#128892" />;
    default:
      return <AiFillFile color="#000000" />;
  }
}
