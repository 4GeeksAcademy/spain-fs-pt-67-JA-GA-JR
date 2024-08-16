// src/components/Home.js
import React from 'react';
import { HomeMovimientos } from './homeMovimientos';
import { HomeObjetivos } from './homeObjetivos';
import { HomeEventos } from './homeEventos';

export const Home = () => {
    return (
        <div className="home-container">
            <main className="home-content">
                <div className="home-section movements-section">
                    <HomeMovimientos />
                </div>
                <div className="home-section goals-section">
                    <HomeObjetivos/>
                </div>
                <div className="home-section events-section">
                    <HomeEventos/>
                </div>
            </main>
        </div>
    );
};






















