document.addEventListener('DOMContentLoaded', () => {
    const periodicTableGrid = document.getElementById('periodic-table-grid');
    const legendContainer = document.getElementById('legend-container');
    const elementDetailModal = document.getElementById('element-detail-modal');
    // FIX: Use querySelector for class, not getElementById
    const closeModalButton = document.querySelector('.close-button');

    const modalElementName = document.getElementById('modal-element-name');
    const modalElementSymbol = document.getElementById('modal-element-symbol');
    const modalElementAtomicNumber = document.getElementById('modal-element-atomic-number');
    const modalElementAtomicMass = document.getElementById('modal-element-atomic-mass');
    const modalElementCategory = document.getElementById('modal-element-category');
    // FIX: Correct id for electron configuration
    const modalElementElectronConfiguration = document.getElementById('modal-element-electron-configuration');
    const modalElementMeltingPoint = document.getElementById('modal-element-melting-point');
    const modalElementBoilingPoint = document.getElementById('modal-element-boiling-point');
    const modalElementDensity = document.getElementById('modal-element-density');
    const modalElementDiscoveredBy = document.getElementById('modal-element-discovered-by');
    const modalElementDiscoveryYear = document.getElementById('modal-element-discovery-year');
    const modalElementDescription = document.getElementById('modal-element-description');

    // FIX: Remove stray closing bracket and ensure array is valid
    const elementsData = [
        // Row 1
        { name: 'Hydrogen', symbol: 'H', atomicNumber: 1, atomicMass: 1.008, category: 'Nonmetal', electronConfiguration: '1s¹', meltingPoint: '-259.16 °C', boilingPoint: '-252.87 °C', density: '0.08988 g/L', discoveredBy: 'Henry Cavendish', discoveryYear: 1766, description: 'The most abundant element in the universe.' },
        { name: '', symbol: '', atomicNumber: 0, category: 'empty', gridColumn: 'span 16' }, // Empty cells for layout
        { name: 'Helium', symbol: 'He', atomicNumber: 2, atomicMass: 4.0026, category: 'Noble Gas', electronConfiguration: '1s²', meltingPoint: '-272.2 °C', boilingPoint: '-268.93 °C', density: '0.1786 g/L', discoveredBy: 'Pierre Janssen, Norman Lockyer', discoveryYear: 1868, description: 'An inert gas and the second lightest element.' },

        // Row 2
        { name: 'Lithium', symbol: 'Li', atomicNumber: 3, atomicMass: 6.94, category: 'Alkali Metal', electronConfiguration: '[He] 2s¹', meltingPoint: '180.5 °C', boilingPoint: '1342 °C', density: '0.534 g/cm³', discoveredBy: 'Johan August Arfwedson', discoveryYear: 1817, description: 'The lightest metal, used in batteries.' },
        { name: 'Beryllium', symbol: 'Be', atomicNumber: 4, atomicMass: 9.0122, category: 'Alkaline Earth Metal', electronConfiguration: '[He] 2s²', meltingPoint: '1287 °C', boilingPoint: '2471 °C', density: '1.85 g/cm³', discoveredBy: 'Louis-Nicolas Vauquelin', discoveryYear: 1798, description: 'A light and strong metal, used in alloys.' },
        { name: '', symbol: '', atomicNumber: 0, category: 'empty', gridColumn: 'span 10' },
        { name: 'Boron', symbol: 'B', atomicNumber: 5, atomicMass: 10.81, category: 'Metalloid', electronConfiguration: '[He] 2s² 2p¹', meltingPoint: '2075 °C', boilingPoint: '3927 °C', density: '2.34 g/cm³', discoveredBy: 'Humphry Davy, Joseph Louis Gay-Lussac, Louis Jacques Thénard', discoveryYear: 1808, description: 'A semimetal with intermediate properties.' },
        { name: 'Carbon', symbol: 'C', atomicNumber: 6, atomicMass: 12.011, category: 'Nonmetal', electronConfiguration: '[He] 2s² 2p²', meltingPoint: '3500 °C', boilingPoint: '4827 °C', density: '2.267 g/cm³ (graphite)', discoveredBy: 'Antiquity', discoveryYear: null, description: 'Base of all organic life.' },
        { name: 'Nitrogen', symbol: 'N', atomicNumber: 7, atomicMass: 14.007, category: 'Nonmetal', electronConfiguration: '[He] 2s² 2p³', meltingPoint: '-210 °C', boilingPoint: '-195.8 °C', density: '1.251 g/L', discoveredBy: 'Daniel Rutherford', discoveryYear: 1772, description: 'Main component of air.' },
        { name: 'Oxygen', symbol: 'O', atomicNumber: 8, atomicMass: 15.999, category: 'Nonmetal', electronConfiguration: '[He] 2s² 2p⁴', meltingPoint: '-218.79 °C', boilingPoint: '-182.95 °C', density: '1.429 g/L', discoveredBy: 'Joseph Priestley, Carl Wilhelm Scheele', discoveryYear: 1774, description: 'Essential for respiration.' },
        { name: 'Fluorine', symbol: 'F', atomicNumber: 9, atomicMass: 18.998, category: 'Halogen', electronConfiguration: '[He] 2s² 2p⁵', meltingPoint: '-219.62 °C', boilingPoint: '-188.12 °C', density: '1.696 g/L', discoveredBy: 'Henri Moissan', discoveryYear: 1886, description: 'The most reactive element.' },
        { name: 'Neon', symbol: 'Ne', atomicNumber: 10, atomicMass: 20.180, category: 'Noble Gas', electronConfiguration: '[He] 2s² 2p⁶', meltingPoint: '-248.59 °C', boilingPoint: '-246.08 °C', density: '0.9002 g/L', discoveredBy: 'William Ramsay, Morris Travers', discoveryYear: 1898, description: 'Used in illuminated signs.' },

        // Row 3
        { name: 'Sodium', symbol: 'Na', atomicNumber: 11, atomicMass: 22.990, category: 'Alkali Metal', electronConfiguration: '[Ne] 3s¹', meltingPoint: '97.72 °C', boilingPoint: '883 °C', density: '0.968 g/cm³', discoveredBy: 'Humphry Davy', discoveryYear: 1807, description: 'A soft and reactive metal.' },
        { name: 'Magnesium', symbol: 'Mg', atomicNumber: 12, atomicMass: 24.305, category: 'Alkaline Earth Metal', electronConfiguration: '[Ne] 3s²', meltingPoint: '650 °C', boilingPoint: '1091 °C', density: '1.738 g/cm³', discoveredBy: 'Joseph Black', discoveryYear: 1755, description: 'Light and strong metal, used in alloys.' },
        { name: '', symbol: '', atomicNumber: 0, category: 'empty', gridColumn: 'span 10' },
        { name: 'Aluminum', symbol: 'Al', atomicNumber: 13, atomicMass: 26.982, category: 'Post-Transition Metal', electronConfiguration: '[Ne] 3s² 3p¹', meltingPoint: '660.32 °C', boilingPoint: '2519 °C', density: '2.70 g/cm³', discoveredBy: 'Hans Christian Ørsted', discoveryYear: 1825, description: 'Light and corrosion-resistant metal.' },
        { name: 'Silicon', symbol: 'Si', atomicNumber: 14, atomicMass: 28.085, category: 'Metalloid', electronConfiguration: '[Ne] 3s² 3p²', meltingPoint: '1414 °C', boilingPoint: '3265 °C', density: '2.329 g/cm³', discoveredBy: 'Jöns Jacob Berzelius', discoveryYear: 1823, description: 'Base of semiconductors.' },
        { name: 'Phosphorus', symbol: 'P', atomicNumber: 15, atomicMass: 30.974, category: 'Nonmetal', electronConfiguration: '[Ne] 3s² 3p³', meltingPoint: '44.1 °C (white)', boilingPoint: '280.5 °C (white)', density: '1.823 g/cm³ (white)', discoveredBy: 'Hennig Brand', discoveryYear: 1669, description: 'Essential for DNA.' },
        { name: 'Sulfur', symbol: 'S', atomicNumber: 16, atomicMass: 32.06, category: 'Nonmetal', electronConfiguration: '[Ne] 3s² 3p⁴', meltingPoint: '115.21 °C', boilingPoint: '444.6 °C', density: '2.07 g/cm³', discoveredBy: 'Antiquity', discoveryYear: null, description: 'Used in acids and fertilizers.' },
        { name: 'Chlorine', symbol: 'Cl', atomicNumber: 17, atomicMass: 35.45, category: 'Halogen', electronConfiguration: '[Ne] 3s² 3p⁵', meltingPoint: '-101.5 °C', boilingPoint: '-34.04 °C', density: '3.2 g/L', discoveredBy: 'Carl Wilhelm Scheele', discoveryYear: 1774, description: 'Yellow-green gas, disinfectant.' },
        { name: 'Argon', symbol: 'Ar', atomicNumber: 18, atomicMass: 39.948, category: 'Noble Gas', electronConfiguration: '[Ne] 3s² 3p⁶', meltingPoint: '-189.34 °C', boilingPoint: '-185.84 °C', density: '1.784 g/L', discoveredBy: 'Lord Rayleigh, William Ramsay', discoveryYear: 1894, description: 'Inert gas, used in lamps.' },

        // Row 4 (Simplified Transition Metals block)
        { name: 'Potassium', symbol: 'K', atomicNumber: 19, atomicMass: 39.098, category: 'Alkali Metal', electronConfiguration: '[Ar] 4s¹', meltingPoint: '63.5 °C', boilingPoint: '759 °C', density: '0.862 g/cm³', discoveredBy: 'Humphry Davy', discoveryYear: 1807, description: 'Soft and reactive metal, essential for life.' },
        { name: 'Calcium', symbol: 'Ca', atomicNumber: 20, atomicMass: 40.078, category: 'Alkaline Earth Metal', electronConfiguration: '[Ar] 4s²', meltingPoint: '842 °C', boilingPoint: '1484 °C', density: '1.55 g/cm³', discoveredBy: 'Humphry Davy', discoveryYear: 1808, description: 'Important for bones and teeth.' },
        { name: 'Scandium', symbol: 'Sc', atomicNumber: 21, atomicMass: 44.956, category: 'Transition Metal', electronConfiguration: '[Ar] 3d¹ 4s²', meltingPoint: '1541 °C', boilingPoint: '2836 °C', density: '2.989 g/cm³', discoveredBy: 'Lars Fredrik Nilson', discoveryYear: 1879, description: 'Light metal, used in aerospace alloys.' },
        { name: 'Titanium', symbol: 'Ti', atomicNumber: 22, atomicMass: 47.867, category: 'Transition Metal', electronConfiguration: '[Ar] 3d² 4s²', meltingPoint: '1668 °C', boilingPoint: '3287 °C', density: '4.506 g/cm³', discoveredBy: 'William Gregor', discoveryYear: 1791, description: 'Strong and light metal, resistant to corrosion.' },
        { name: 'Vanadium', symbol: 'V', atomicNumber: 23, atomicMass: 50.942, category: 'Transition Metal', electronConfiguration: '[Ar] 3d³ 4s²', meltingPoint: '1910 °C', boilingPoint: '3407 °C', density: '6.11 g/cm³', discoveredBy: 'Andrés Manuel del Río', discoveryYear: 1801, description: 'Used in steel alloys for its strength.' },
        { name: 'Chromium', symbol: 'Cr', atomicNumber: 24, atomicMass: 51.996, category: 'Transition Metal', electronConfiguration: '[Ar] 3d⁵ 4s¹', meltingPoint: '1857 °C', boilingPoint: '2672 °C', density: '7.19 g/cm³', discoveredBy: 'Louis Nicolas Vauquelin', discoveryYear: 1797, description: 'Used to provide shine and corrosion resistance.' },
        { name: 'Manganese', symbol: 'Mn', atomicNumber: 25, atomicMass: 54.938, category: 'Transition Metal', electronConfiguration: '[Ar] 3d⁵ 4s²', meltingPoint: '1246 °C', boilingPoint: '2061 °C', density: '7.21 g/cm³', discoveredBy: 'Johan Gottlieb Gahn', discoveryYear: 1774, description: 'Important in steel production.' },
        { name: 'Iron', symbol: 'Fe', atomicNumber: 26, atomicMass: 55.845, category: 'Transition Metal', electronConfiguration: '[Ar] 3d⁶ 4s²', meltingPoint: '1538 °C', boilingPoint: '2862 °C', density: '7.874 g/cm³', discoveredBy: 'Antiquity', discoveryYear: null, description: 'Most common metal on Earth, base of steel.' },
        { name: 'Cobalt', symbol: 'Co', atomicNumber: 27, atomicMass: 58.933, category: 'Transition Metal', electronConfiguration: '[Ar] 3d⁷ 4s²', meltingPoint: '1495 °C', boilingPoint: '2927 °C', density: '8.90 g/cm³', discoveredBy: 'Georg Brandt', discoveryYear: 1735, description: 'Used in alloys and batteries.' },
        { name: 'Nickel', symbol: 'Ni', atomicNumber: 28, atomicMass: 58.693, category: 'Transition Metal', electronConfiguration: '[Ar] 3d⁸ 4s²', meltingPoint: '1455 °C', boilingPoint: '2913 °C', density: '8.908 g/cm³', discoveredBy: 'Axel Fredrik Cronstedt', discoveryYear: 1751, description: 'Corrosion-resistant, used in coins.' },
        { name: 'Copper', symbol: 'Cu', atomicNumber: 29, atomicMass: 63.546, category: 'Transition Metal', electronConfiguration: '[Ar] 3d¹⁰ 4s¹', meltingPoint: '1084.62 °C', boilingPoint: '2562 °C', density: '8.96 g/cm³', discoveredBy: 'Antiquity', discoveryYear: null, description: 'Excellent conductor of electricity and heat.' },
        { name: 'Zinc', symbol: 'Zn', atomicNumber: 30, atomicMass: 65.38, category: 'Transition Metal', electronConfiguration: '[Ar] 3d¹⁰ 4s²', meltingPoint: '419.53 °C', boilingPoint: '907 °C', density: '7.14 g/cm³', discoveredBy: 'Andreas Sigismund Marggraf', discoveryYear: 1746, description: 'Used to galvanize and protect metals.' },
        { name: 'Gallium', symbol: 'Ga', atomicNumber: 31, atomicMass: 69.723, category: 'Post-Transition Metal', electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p¹', meltingPoint: '29.76 °C', boilingPoint: '2204 °C', density: '5.904 g/cm³', discoveredBy: 'Paul-Émile Lecoq de Boisbaudran', discoveryYear: 1875, description: 'Metal that melts in your hand.' },
        { name: 'Germanium', symbol: 'Ge', atomicNumber: 32, atomicMass: 72.63, category: 'Metalloid', electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p²', meltingPoint: '938.25 °C', boilingPoint: '2833 °C', density: '5.323 g/cm³', discoveredBy: 'Clemens Winkler', discoveryYear: 1886, description: 'Semimetal used in electronics.' },
        { name: 'Arsenic', symbol: 'As', atomicNumber: 33, atomicMass: 74.922, category: 'Metalloid', electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p³', meltingPoint: '817 °C (sublimes)', boilingPoint: '614 °C (sublimes)', density: '5.727 g/cm³', discoveredBy: 'Albertus Magnus', discoveryYear: 1250, description: 'Toxic, used in semiconductors.' },
        { name: 'Selenium', symbol: 'Se', atomicNumber: 34, atomicMass: 78.971, category: 'Nonmetal', electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁴', meltingPoint: '221 °C', boilingPoint: '685 °C', density: '4.81 g/cm³', discoveredBy: 'Jöns Jacob Berzelius', discoveryYear: 1817, description: 'Used in electronics and pigments.' },
        { name: 'Bromine', symbol: 'Br', atomicNumber: 35, atomicMass: 79.904, category: 'Halogen', electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁵', meltingPoint: '-7.2 °C', boilingPoint: '58.8 °C', density: '3.1028 g/cm³', discoveredBy: 'Antoine Jérôme Balard', discoveryYear: 1826, description: 'Volatile red-brown liquid.' },
        { name: 'Krypton', symbol: 'Kr', atomicNumber: 36, atomicMass: 83.798, category: 'Noble Gas', electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁶', meltingPoint: '-157.36 °C', boilingPoint: '-153.22 °C', density: '3.749 g/L', discoveredBy: 'William Ramsay, Morris Travers', discoveryYear: 1898, description: 'Used in lighting and lasers.' },

        // Row 5 (Simplified)
        { name: 'Rubidium', symbol: 'Rb', atomicNumber: 37, atomicMass: 85.468, category: 'Alkali Metal', electronConfiguration: '[Kr] 5s¹', meltingPoint: '39.3 °C', boilingPoint: '688 °C', density: '1.532 g/cm³', discoveredBy: 'Robert Bunsen, Gustav Kirchhoff', discoveryYear: 1861, description: 'Soft and highly reactive metal.' },
        { name: 'Strontium', symbol: 'Sr', atomicNumber: 38, atomicMass: 87.62, category: 'Alkaline Earth Metal', electronConfiguration: '[Kr] 5s²', meltingPoint: '777 °C', boilingPoint: '1377 °C', density: '2.64 g/cm³', discoveredBy: 'Adair Crawford', discoveryYear: 1790, description: 'Used in fireworks (red color).' },
        { name: 'Yttrium', symbol: 'Y', atomicNumber: 39, atomicMass: 88.906, category: 'Transition Metal', electronConfiguration: '[Kr] 4d¹ 5s²', meltingPoint: '1526 °C', boilingPoint: '3338 °C', density: '4.472 g/cm³', discoveredBy: 'Johan Gadolin', discoveryYear: 1794, description: 'Used in alloys and lasers.' },
        { name: 'Zirconium', symbol: 'Zr', atomicNumber: 40, atomicMass: 91.224, category: 'Transition Metal', electronConfiguration: '[Kr] 4d² 5s²', meltingPoint: '1855 °C', boilingPoint: '4377 °C', density: '6.511 g/cm³', discoveredBy: 'Martin Heinrich Klaproth', discoveryYear: 1789, description: 'Corrosion-resistant, used in nuclear reactors.' },
        { name: 'Niobium', symbol: 'Nb', atomicNumber: 41, atomicMass: 92.906, category: 'Transition Metal', electronConfiguration: '[Kr] 4d⁴ 5s¹', meltingPoint: '2477 °C', boilingPoint: '4744 °C', density: '8.57 g/cm³', discoveredBy: 'Charles Hatchett', discoveryYear: 1801, description: 'Used in special steels and superconductors.' },
        { name: 'Molybdenum', symbol: 'Mo', atomicNumber: 42, atomicMass: 95.95, category: 'Transition Metal', electronConfiguration: '[Kr] 4d⁵ 5s¹', meltingPoint: '2623 °C', boilingPoint: '4639 °C', density: '10.28 g/cm³', discoveredBy: 'Carl Wilhelm Scheele', discoveryYear: 1778, description: 'Used in high-strength alloys.' },
        { name: 'Technetium', symbol: 'Tc', atomicNumber: 43, atomicMass: 98, category: 'Transition Metal', electronConfiguration: '[Kr] 4d⁵ 5s²', meltingPoint: '2172 °C', boilingPoint: '4265 °C', density: '11 g/cm³', discoveredBy: 'Emilio Segrè, Carlo Perrier', discoveryYear: 1937, description: 'The lightest element with no stable isotopes.' },
        { name: 'Ruthenium', symbol: 'Ru', atomicNumber: 44, atomicMass: 101.07, category: 'Transition Metal', electronConfiguration: '[Kr] 4d⁷ 5s¹', meltingPoint: '2334 °C', boilingPoint: '4150 °C', density: '12.45 g/cm³', discoveredBy: 'Karl Ernst Claus', discoveryYear: 1844, description: 'Rare metal, used in platinum alloys.' },
        { name: 'Rhodium', symbol: 'Rh', atomicNumber: 45, atomicMass: 102.91, category: 'Transition Metal', electronConfiguration: '[Kr] 4d⁸ 5s¹', meltingPoint: '1964 °C', boilingPoint: '3695 °C', density: '12.41 g/cm³', discoveredBy: 'William Hyde Wollaston', discoveryYear: 1803, description: 'Precious metal, used in catalysts.' },
        { name: 'Palladium', symbol: 'Pd', atomicNumber: 46, atomicMass: 106.42, category: 'Transition Metal', electronConfiguration: '[Kr] 4d¹⁰', meltingPoint: '1554.9 °C', boilingPoint: '2963 °C', density: '12.023 g/cm³', discoveredBy: 'William Hyde Wollaston', discoveryYear: 1803, description: 'Used in catalysts and jewelry.' },
        { name: 'Silver', symbol: 'Ag', atomicNumber: 47, atomicMass: 107.868, category: 'Transition Metal', electronConfiguration: '[Kr] 4d¹⁰ 5s¹', meltingPoint: '961.78 °C', boilingPoint: '2162 °C', density: '10.49 g/cm³', discoveredBy: 'Antiquity', discoveryYear: null, description: 'Precious metal, excellent conductor.' },
        { name: 'Cadmium', symbol: 'Cd', atomicNumber: 48, atomicMass: 112.414, category: 'Transition Metal', electronConfiguration: '[Kr] 4d¹⁰ 5s²', meltingPoint: '321.07 °C', boilingPoint: '767 °C', density: '8.65 g/cm³', discoveredBy: 'Friedrich Stromeyer', discoveryYear: 1817, description: 'Toxic, used in batteries and pigments.' },
        { name: 'Indium', symbol: 'In', atomicNumber: 49, atomicMass: 114.818, category: 'Post-Transition Metal', electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p¹', meltingPoint: '156.6 °C', boilingPoint: '2072 °C', density: '7.31 g/cm³', discoveredBy: 'Ferdinand Reich, Hieronymus Theodor Richter', discoveryYear: 1863, description: 'Soft metal, used in alloys and electronics.' },
        { name: 'Tin', symbol: 'Sn', atomicNumber: 50, atomicMass: 118.710, category: 'Post-Transition Metal', electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p²', meltingPoint: '231.93 °C', boilingPoint: '2602 °C', density: '7.26 g/cm³', discoveredBy: 'Antiquity', discoveryYear: null, description: 'Used in solders and coatings.' },
        { name: 'Antimony', symbol: 'Sb', atomicNumber: 51, atomicMass: 121.760, category: 'Metalloid', electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p³', meltingPoint: '630.63 °C', boilingPoint: '1587 °C', density: '6.697 g/cm³', discoveredBy: 'Antiquity', discoveryYear: null, description: 'Semimetal used in alloys and electronics.' },
        { name: 'Tellurium', symbol: 'Te', atomicNumber: 52, atomicMass: 127.60, category: 'Metalloid', electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁴', meltingPoint: '449.5 °C', boilingPoint: '988 °C', density: '6.24 g/cm³', discoveredBy: 'Franz-Joseph Müller von Reichenstein', discoveryYear: 1782, description: 'Rare semimetal, used in alloys and semiconductors.' },
        { name: 'Iodine', symbol: 'I', atomicNumber: 53, atomicMass: 126.904, category: 'Halogen', electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁵', meltingPoint: '113.7 °C', boilingPoint: '184.3 °C', density: '4.933 g/cm³', discoveredBy: 'Bernard Courtois', discoveryYear: 1811, description: 'Dark solid that sublimes into purple vapor.' },
        { name: 'Xenon', symbol: 'Xe', atomicNumber: 54, atomicMass: 131.293, category: 'Noble Gas', electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁶', meltingPoint: '-111.7 °C', boilingPoint: '-108.1 °C', density: '5.894 g/L', discoveredBy: 'William Ramsay, Morris Travers', discoveryYear: 1898, description: 'Used in flash lamps and headlights.' },

        // Row 6 (with Lanthanides placeholder)
        { name: 'Cesium', symbol: 'Cs', atomicNumber: 55, atomicMass: 132.905, category: 'Alkali Metal', electronConfiguration: '[Xe] 6s¹', meltingPoint: '28.4 °C', boilingPoint: '671 °C', density: '1.879 g/cm³', discoveredBy: 'Robert Bunsen, Gustav Kirchhoff', discoveryYear: 1860, description: 'Soft metal, used in atomic clocks.' },
        { name: 'Barium', symbol: 'Ba', atomicNumber: 56, atomicMass: 137.327, category: 'Alkaline Earth Metal', electronConfiguration: '[Xe] 6s²', meltingPoint: '727 °C', boilingPoint: '1897 °C', density: '3.51 g/cm³', discoveredBy: 'Carl Wilhelm Scheele', discoveryYear: 1774, description: 'Used in fireworks (green color).' },
        { name: 'Lanthanides', symbol: 'La-Lu', atomicNumber: '57-71', category: 'Lanthanide', gridColumn: 'span 1', description: 'Series of rare earth elements.' }, // Placeholder for Lanthanides
        { name: 'Hafnium', symbol: 'Hf', atomicNumber: 72, atomicMass: 178.49, category: 'Transition Metal', electronConfiguration: '[Xe] 4f¹⁴ 5d² 6s²', meltingPoint: '2233 °C', boilingPoint: '4603 °C', density: '13.31 g/cm³', discoveredBy: 'Dirk Coster, George de Hevesy', discoveryYear: 1923, description: 'Used in superalloys and nuclear reactors.' },
        { name: 'Tantalum', symbol: 'Ta', atomicNumber: 73, atomicMass: 180.948, category: 'Transition Metal', electronConfiguration: '[Xe] 4f¹⁴ 5d³ 6s²', meltingPoint: '3017 °C', boilingPoint: '5458 °C', density: '16.69 g/cm³', discoveredBy: 'Anders Gustaf Ekeberg', discoveryYear: 1802, description: 'Highly corrosion-resistant metal.' },
        { name: 'Tungsten', symbol: 'W', atomicNumber: 74, atomicMass: 183.84, category: 'Transition Metal', electronConfiguration: '[Xe] 4f¹⁴ 5d⁴ 6s²', meltingPoint: '3422 °C', boilingPoint: '5930 °C', density: '19.25 g/cm³', discoveredBy: 'Juan José Elhuyar, Fausto Elhuyar', discoveryYear: 1783, description: 'Highest melting point of all metals.' },
        { name: 'Rhenium', symbol: 'Re', atomicNumber: 75, atomicMass: 186.207, category: 'Transition Metal', electronConfiguration: '[Xe] 4f¹⁴ 5d⁵ 6s²', meltingPoint: '3186 °C', boilingPoint: '5596 °C', density: '21.02 g/cm³', discoveredBy: 'Walter Noddack, Ida Tacke, Otto Berg', discoveryYear: 1925, description: 'Rare metal, used in superalloys.' },
        { name: 'Osmium', symbol: 'Os', atomicNumber: 76, atomicMass: 190.23, category: 'Transition Metal', electronConfiguration: '[Xe] 4f¹⁴ 5d⁶ 6s²', meltingPoint: '3033 °C', boilingPoint: '5012 °C', density: '22.59 g/cm³', discoveredBy: 'Smithson Tennant', discoveryYear: 1803, description: 'The densest element.' },
        { name: 'Iridium', symbol: 'Ir', atomicNumber: 77, atomicMass: 192.217, category: 'Transition Metal', electronConfiguration: '[Xe] 4f¹⁴ 5d⁷ 6s²', meltingPoint: '2466 °C', boilingPoint: '4428 °C', density: '22.56 g/cm³', discoveredBy: 'Smithson Tennant', discoveryYear: 1803, description: 'Corrosion-resistant metal, used in alloys.' },
        { name: 'Platinum', symbol: 'Pt', atomicNumber: 78, atomicMass: 195.084, category: 'Transition Metal', electronConfiguration: '[Xe] 4f¹⁴ 5d⁹ 6s¹', meltingPoint: '1768.3 °C', boilingPoint: '3825 °C', density: '21.45 g/cm³', discoveredBy: 'Antiquity', discoveryYear: null, description: 'Precious metal, used in jewelry and catalysts.' },
        { name: 'Gold', symbol: 'Au', atomicNumber: 79, atomicMass: 196.967, category: 'Transition Metal', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', meltingPoint: '1064.18 °C', boilingPoint: '2856 °C', density: '19.3 g/cm³', discoveredBy: 'Antiquity', discoveryYear: null, description: 'Precious metal, highly malleable.' },
        { name: 'Mercury', symbol: 'Hg', atomicNumber: 80, atomicMass: 200.592, category: 'Transition Metal', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s²', meltingPoint: '-38.83 °C', boilingPoint: '356.73 °C', density: '13.534 g/cm³', discoveredBy: 'Antiquity', discoveryYear: null, description: 'The only metal liquid at room temperature.' },
        { name: 'Thallium', symbol: 'Tl', atomicNumber: 81, atomicMass: 204.38, category: 'Post-Transition Metal', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹', meltingPoint: '304 °C', boilingPoint: '1473 °C', density: '11.85 g/cm³', discoveredBy: 'William Crookes', discoveryYear: 1861, description: 'Soft and toxic metal.' },
        { name: 'Lead', symbol: 'Pb', atomicNumber: 82, atomicMass: 207.2, category: 'Post-Transition Metal', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²', meltingPoint: '327.46 °C', boilingPoint: '1749 °C', density: '11.34 g/cm³', discoveredBy: 'Antiquity', discoveryYear: null, description: 'Heavy and malleable metal.' },
        { name: 'Bismuth', symbol: 'Bi', atomicNumber: 83, atomicMass: 208.980, category: 'Post-Transition Metal', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³', meltingPoint: '271.4 °C', boilingPoint: '1564 °C', density: '9.78 g/cm³', discoveredBy: 'Claude Geoffroy le Jeune', discoveryYear: 1753, description: 'Brittle metal, used in low-melting-point alloys.' },
        { name: 'Polonium', symbol: 'Po', atomicNumber: 84, atomicMass: 209, category: 'Metalloid', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴', meltingPoint: '254 °C', boilingPoint: '962 °C', density: '9.196 g/cm³', discoveredBy: 'Marie Curie, Pierre Curie', discoveryYear: 1898, description: 'Rare radioactive element.' },
        { name: 'Astatine', symbol: 'At', atomicNumber: 85, atomicMass: 210, category: 'Halogen', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵', meltingPoint: '302 °C', boilingPoint: '337 °C', density: '7 g/cm³ (estimated)', discoveredBy: 'Dale R. Corson, Kenneth R. MacKenzie, Emilio Segrè', discoveryYear: 1940, description: 'The rarest and most radioactive halogen.' },
        { name: 'Radon', symbol: 'Rn', atomicNumber: 86, atomicMass: 222, category: 'Noble Gas', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶', meltingPoint: '-71 °C', boilingPoint: '-61.7 °C', density: '9.73 g/L', discoveredBy: 'Friedrich Ernst Dorn', discoveryYear: 1900, description: 'Radioactive gas, a product of radium decay.' },
        { name: 'Francium', symbol: 'Fr', atomicNumber: 87, atomicMass: 223, category: 'Alkali Metal', electronConfiguration: '[Rn] 7s¹', meltingPoint: '27 °C', boilingPoint: '677 °C', density: '1.87 g/cm³ (estimated)', discoveredBy: 'Marguerite Perey', discoveryYear: 1939, description: 'The second heaviest and radioactive alkali element.' },
        { name: 'Radium', symbol: 'Ra', atomicNumber: 88, atomicMass: 226, category: 'Alkaline Earth Metal', electronConfiguration: '[Rn] 7s²', meltingPoint: '700 °C', boilingPoint: '1737 °C', density: '5.5 g/cm³', discoveredBy: 'Marie Curie, Pierre Curie', discoveryYear: 1898, description: 'Luminescent radioactive element.' },
        { name: 'Actinides', symbol: 'Ac-Lr', atomicNumber: 89-103, category: 'Actinide', gridColumn: 'span 1', description: 'Series of heavy radioactive elements.' }, // Placeholder for Actinides
        { name: 'Rutherfordium', symbol: 'Rf', atomicNumber: 104, atomicMass: 267, category: 'Transition Metal', electronConfiguration: '[Rn] 5f¹⁴ 6d² 7s²', meltingPoint: '2100 °C (estimated)', boilingPoint: '5500 °C (estimated)', density: '23.2 g/cm³ (estimated)', discoveredBy: 'Joint Institute for Nuclear Research / Lawrence Berkeley National Laboratory', discoveryYear: 1964, description: 'Synthetic and highly radioactive element.' },
        { name: 'Dubnium', symbol: 'Db', atomicNumber: 105, atomicMass: 268, category: 'Transition Metal', electronConfiguration: '[Rn] 5f¹⁴ 6d³ 7s²', meltingPoint: '1800 °C (estimated)', boilingPoint: 'unknown', density: '29.3 g/cm³ (estimated)', discoveredBy: 'Joint Institute for Nuclear Research / Lawrence Berkeley National Laboratory', discoveryYear: 1968, description: 'Synthetic and extremely unstable element.' },
        { name: 'Seaborgium', symbol: 'Sg', atomicNumber: 106, atomicMass: 271, category: 'Transition Metal', electronConfiguration: '[Rn] 5f¹⁴ 6d⁴ 7s²', meltingPoint: 'unknown', boilingPoint: 'unknown', density: '35 g/cm³ (estimated)', discoveredBy: 'Lawrence Berkeley National Laboratory', discoveryYear: 1974, description: 'Synthetic element, named after Glenn Seaborg.' },
        { name: 'Bohrium', symbol: 'Bh', atomicNumber: 107, atomicMass: 272, category: 'Transition Metal', electronConfiguration: '[Rn] 5f¹⁴ 6d⁵ 7s²', meltingPoint: 'unknown', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Gesellschaft für Schwerionenforschung (GSI)', discoveryYear: 1976, description: 'Synthetic and very radioactive element.' },
        { name: 'Hassium', symbol: 'Hs', atomicNumber: 108, atomicMass: 277, category: 'Transition Metal', electronConfiguration: '[Rn] 5f¹⁴ 6d⁶ 7s²', meltingPoint: 'unknown', boilingPoint: 'unknown', density: '40.7 g/cm³ (estimated)', discoveredBy: 'Gesellschaft für Schwerionenforschung (GSI)', discoveryYear: 1984, description: 'Synthetic and extremely heavy element.' },
        { name: 'Meitnerium', symbol: 'Mt', atomicNumber: 109, atomicMass: 276, category: 'Transition Metal', electronConfiguration: '[Rn] 5f¹⁴ 6d⁷ 7s²', meltingPoint: 'unknown', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Gesellschaft für Schwerionenforschung (GSI)', discoveryYear: 1982, description: 'Synthetic element, named after Lise Meitner.' },
        { name: 'Darmstadtium', symbol: 'Ds', atomicNumber: 110, atomicMass: 281, category: 'Transition Metal', electronConfiguration: '[Rn] 5f¹⁴ 6d⁸ 7s²', meltingPoint: 'unknown', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Gesellschaft für Schwerionenforschung (GSI)', discoveryYear: 1994, description: 'Synthetic and superheavy element.' },
        { name: 'Roentgenium', symbol: 'Rg', atomicNumber: 111, atomicMass: 282, category: 'Transition Metal', electronConfiguration: '[Rn] 5f¹⁴ 6d⁹ 7s²', meltingPoint: 'unknown', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Gesellschaft für Schwerionenforschung (GSI)', discoveryYear: 1994, description: 'Synthetic element, named after Wilhelm Röntgen.' },
        { name: 'Copernicium', symbol: 'Cn', atomicNumber: 112, atomicMass: 285, category: 'Transition Metal', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s²', meltingPoint: 'unknown', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Gesellschaft für Schwerionenforschung (GSI)', discoveryYear: 1996, description: 'Synthetic element, named after Nicolaus Copernicus.' },
        { name: 'Nihonium', symbol: 'Nh', atomicNumber: 113, atomicMass: 286, category: 'Post-Transition Metal', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹', meltingPoint: 'unknown', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'RIKEN', discoveryYear: 2003, description: 'Synthetic and highly radioactive element.' },
        { name: 'Flerovium', symbol: 'Fl', atomicNumber: 114, atomicMass: 289, category: 'Post-Transition Metal', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²', meltingPoint: 'unknown', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Joint Institute for Nuclear Research / Lawrence Livermore National Laboratory', discoveryYear: 1999, description: 'Synthetic and superheavy element.' },
        { name: 'Moscovium', symbol: 'Mc', atomicNumber: 115, atomicMass: 290, category: 'Post-Transition Metal', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³', meltingPoint: 'unknown', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Joint Institute for Nuclear Research / Lawrence Livermore National Laboratory', discoveryYear: 2003, description: 'Synthetic and extremely radioactive element.' },
        { name: 'Livermorium', symbol: 'Lv', atomicNumber: 116, atomicMass: 293, category: 'Post-Transition Metal', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴', meltingPoint: 'unknown', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Joint Institute for Nuclear Research / Lawrence Livermore National Laboratory', discoveryYear: 2000, description: 'Synthetic, superheavy and radioactive element.' },
        { name: 'Tennessine', symbol: 'Ts', atomicNumber: 117, atomicMass: 294, category: 'Halogen', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵', meltingPoint: 'unknown', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Joint Institute for Nuclear Research / Oak Ridge National Laboratory', discoveryYear: 2010, description: 'Synthetic element and the second heaviest halogen.' },
        { name: 'Oganesson', symbol: 'Og', atomicNumber: 118, atomicMass: 294, category: 'Noble Gas', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶', meltingPoint: 'unknown', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Joint Institute for Nuclear Research / Lawrence Livermore National Laboratory', discoveryYear: 2002, description: 'Synthetic element, the heaviest noble gas.' },

        // Lanthanides (separate block below)
        { name: 'Lanthanum', symbol: 'La', atomicNumber: 57, atomicMass: 138.905, category: 'Lanthanide', electronConfiguration: '[Xe] 5d¹ 6s²', meltingPoint: '920 °C', boilingPoint: '3464 °C', density: '6.162 g/cm³', discoveredBy: 'Carl Gustaf Mosander', discoveryYear: 1839, description: 'Silvery metal, used in alloys and lenses.', gridRow: 8, gridColumn: 3 },
        { name: 'Cerium', symbol: 'Ce', atomicNumber: 58, atomicMass: 140.116, category: 'Lanthanide', electronConfiguration: '[Xe] 4f¹ 5d¹ 6s²', meltingPoint: '795 °C', boilingPoint: '3443 °C', density: '6.77 g/cm³', discoveredBy: 'Martin Heinrich Klaproth, Jöns Jacob Berzelius, Wilhelm Hisinger', discoveryYear: 1803, description: 'The most abundant lanthanide.' },
        { name: 'Praseodymium', symbol: 'Pr', atomicNumber: 59, atomicMass: 140.908, category: 'Lanthanide', electronConfiguration: '[Xe] 4f³ 6s²', meltingPoint: '935 °C', boilingPoint: '3520 °C', density: '6.77 g/cm³', discoveredBy: 'Carl Auer von Welsbach', discoveryYear: 1885, description: 'Used in colored glass and lasers.' },
        { name: 'Neodymium', symbol: 'Nd', atomicNumber: 60, atomicMass: 144.242, category: 'Lanthanide', electronConfiguration: '[Xe] 4f⁴ 6s²', meltingPoint: '1021 °C', boilingPoint: '3074 °C', density: '7.01 g/cm³', discoveredBy: 'Carl Auer von Welsbach', discoveryYear: 1885, description: 'Used in powerful magnets.' },
        { name: 'Promethium', symbol: 'Pm', atomicNumber: 61, atomicMass: 145, category: 'Lanthanide', electronConfiguration: '[Xe] 4f⁵ 6s²', meltingPoint: '1042 °C', boilingPoint: '3000 °C', density: '7.26 g/cm³', discoveredBy: 'Jacob A. Marinsky, Lawrence E. Glendenin, Charles D. Coryell', discoveryYear: 1945, description: 'Only radioactive lanthanide.' },
        { name: 'Samarium', symbol: 'Sm', atomicNumber: 62, atomicMass: 150.36, category: 'Lanthanide', electronConfiguration: '[Xe] 4f⁶ 6s²', meltingPoint: '1074 °C', boilingPoint: '1794 °C', density: '7.52 g/cm³', discoveredBy: 'Paul-Émile Lecoq de Boisbaudran', discoveryYear: 1879, description: 'Used in magnets and lasers.' },
        { name: 'Europium', symbol: 'Eu', atomicNumber: 63, atomicMass: 151.964, category: 'Lanthanide', electronConfiguration: '[Xe] 4f⁷ 6s²', meltingPoint: '822 °C', boilingPoint: '1529 °C', density: '5.244 g/cm³', discoveredBy: 'Eugène-Anatole Demarçay', discoveryYear: 1901, description: 'Used in color TV phosphors.' },
        { name: 'Gadolinium', symbol: 'Gd', atomicNumber: 64, atomicMass: 157.25, category: 'Lanthanide', electronConfiguration: '[Xe] 4f⁷ 5d¹ 6s²', meltingPoint: '1312 °C', boilingPoint: '3273 °C', density: '7.90 g/cm³', discoveredBy: 'Jean Charles Galissard de Marignac', discoveryYear: 1880, description: 'Used in magnets and MRI.' },
        { name: 'Terbium', symbol: 'Tb', atomicNumber: 65, atomicMass: 158.925, category: 'Lanthanide', electronConfiguration: '[Xe] 4f⁹ 6s²', meltingPoint: '1356 °C', boilingPoint: '3230 °C', density: '8.219 g/cm³', discoveredBy: 'Carl Gustaf Mosander', discoveryYear: 1843, description: 'Used in alloys and lasers.' },
        { name: 'Dysprosium', symbol: 'Dy', atomicNumber: 66, atomicMass: 162.500, category: 'Lanthanide', electronConfiguration: '[Xe] 4f¹⁰ 6s²', meltingPoint: '1412 °C', boilingPoint: '2567 °C', density: '8.55 g/cm³', discoveredBy: 'Paul-Émile Lecoq de Boisbaudran', discoveryYear: 1886, description: 'Used in lasers and magnets.' },
        { name: 'Holmium', symbol: 'Ho', atomicNumber: 67, atomicMass: 164.930, category: 'Lanthanide', electronConfiguration: '[Xe] 4f¹¹ 6s²', meltingPoint: '1474 °C', boilingPoint: '2700 °C', density: '8.795 g/cm³', discoveredBy: 'Per Teodor Cleve', discoveryYear: 1878, description: 'Used in lasers and nuclear control rods.' },
        { name: 'Erbium', symbol: 'Er', atomicNumber: 68, atomicMass: 167.259, category: 'Lanthanide', electronConfiguration: '[Xe] 4f¹² 6s²', meltingPoint: '1529 °C', boilingPoint: '2868 °C', density: '9.066 g/cm³', discoveredBy: 'Carl Gustaf Mosander', discoveryYear: 1843, description: 'Used in fiber optic lasers.' },
        { name: 'Thulium', symbol: 'Tm', atomicNumber: 69, atomicMass: 168.934, category: 'Lanthanide', electronConfiguration: '[Xe] 4f¹³ 6s²', meltingPoint: '1545 °C', boilingPoint: '1950 °C', density: '9.32 g/cm³', discoveredBy: 'Per Teodor Cleve', discoveryYear: 1879, description: 'Used in solid-state lasers.' },
        { name: 'Ytterbium', symbol: 'Yb', atomicNumber: 70, atomicMass: 173.045, category: 'Lanthanide', electronConfiguration: '[Xe] 4f¹⁴ 6s²', meltingPoint: '819 °C', boilingPoint: '1196 °C', density: '6.90 g/cm³', discoveredBy: 'Jean Charles Galissard de Marignac', discoveryYear: 1878, description: 'Used in steels and lasers.' },
        { name: 'Lutetium', symbol: 'Lu', atomicNumber: 71, atomicMass: 174.966, category: 'Lanthanide', electronConfiguration: '[Xe] 4f¹⁴ 5d¹ 6s²', meltingPoint: '1663 °C', boilingPoint: '3402 °C', density: '9.84 g/cm³', discoveredBy: 'Georges Urbain', discoveryYear: 1907, description: 'Used in catalysts and scintillators.' },

        // Actinides (separate block below)
        { name: 'Actinium', symbol: 'Ac', atomicNumber: 89, atomicMass: 227, category: 'Actinide', electronConfiguration: '[Rn] 6d¹ 7s²', meltingPoint: '1050 °C', boilingPoint: '3200 °C', density: '10.07 g/cm³', discoveredBy: 'André-Louis Debierne', discoveryYear: 1899, description: 'Radioactive element, used as a neutron source.', gridRow: 9, gridColumn: 3 },
        { name: 'Thorium', symbol: 'Th', atomicNumber: 90, atomicMass: 232.038, category: 'Actinide', electronConfiguration: '[Rn] 6d² 7s²', meltingPoint: '1750 °C', boilingPoint: '4788 °C', density: '11.72 g/cm³', discoveredBy: 'Jöns Jacob Berzelius', discoveryYear: 1828, description: 'Radioactive, used in nuclear reactors and alloys.' },
        { name: 'Protactinium', symbol: 'Pa', atomicNumber: 91, atomicMass: 231.036, category: 'Actinide', electronConfiguration: '[Rn] 5f² 6d¹ 7s²', meltingPoint: '1568 °C', boilingPoint: '4027 °C', density: '15.37 g/cm³', discoveredBy: 'Kasimir Fajans, Oswald H. Göhring', discoveryYear: 1913, description: 'Radioactive, very rare and toxic.' },
        { name: 'Uranium', symbol: 'U', atomicNumber: 92, atomicMass: 238.029, category: 'Actinide', electronConfiguration: '[Rn] 5f³ 6d¹ 7s²', meltingPoint: '1132.2 °C', boilingPoint: '4131 °C', density: '19.05 g/cm³', discoveredBy: 'Martin Heinrich Klaproth', discoveryYear: 1789, description: 'Radioactive, used in nuclear energy and weapons.' },
        { name: 'Neptunium', symbol: 'Np', atomicNumber: 93, atomicMass: 237, category: 'Actinide', electronConfiguration: '[Rn] 5f⁴ 6d¹ 7s²', meltingPoint: '637 °C', boilingPoint: '4000 °C', density: '20.45 g/cm³', discoveredBy: 'Edwin McMillan, Philip H. Abelson', discoveryYear: 1940, description: 'Transuranic element, radioactive.' },
        { name: 'Plutonium', symbol: 'Pu', atomicNumber: 94, atomicMass: 244, category: 'Actinide', electronConfiguration: '[Rn] 5f⁶ 7s²', meltingPoint: '639.4 °C', boilingPoint: '3228 °C', density: '19.816 g/cm³', discoveredBy: 'Glenn T. Seaborg, Joseph W. Kennedy, Edwin M. McMillan, Arthur C. Wahl', discoveryYear: 1940, description: 'Radioactive, used in nuclear weapons and reactors.' },
        { name: 'Americium', symbol: 'Am', atomicNumber: 95, atomicMass: 243, category: 'Actinide', electronConfiguration: '[Rn] 5f⁷ 7s²', meltingPoint: '1176 °C', boilingPoint: '2607 °C', density: '13.67 g/cm³', discoveredBy: 'Glenn T. Seaborg, Ralph A. James, Leon O. Morgan, Albert Ghiorso', discoveryYear: 1944, description: 'Radioactive, used in smoke detectors.' },
        { name: 'Curium', symbol: 'Cm', atomicNumber: 96, atomicMass: 247, category: 'Actinide', electronConfiguration: '[Rn] 5f⁷ 6d¹ 7s²', meltingPoint: '1340 °C', boilingPoint: '3100 °C', density: '13.51 g/cm³', discoveredBy: 'Glenn T. Seaborg, Ralph A. James, Albert Ghiorso', discoveryYear: 1944, description: 'Radioactive, used in thermoelectric generators.' },
        { name: 'Berkelium', symbol: 'Bk', atomicNumber: 97, atomicMass: 247, category: 'Actinide', electronConfiguration: '[Rn] 5f⁹ 7s²', meltingPoint: '986 °C', boilingPoint: 'unknown', density: '14.78 g/cm³', discoveredBy: 'Glenn T. Seaborg, Albert Ghiorso, Stanley G. Thompson, Kenneth Street Jr.', discoveryYear: 1949, description: 'Radioactive, transuranic element.' },
        { name: 'Californium', symbol: 'Cf', atomicNumber: 98, atomicMass: 251, category: 'Actinide', electronConfiguration: '[Rn] 5f¹⁰ 7s²', meltingPoint: '900 °C', boilingPoint: 'unknown', density: '15.1 g/cm³', discoveredBy: 'Glenn T. Seaborg, Stanley G. Thompson, Albert Ghiorso, Kenneth Street Jr.', discoveryYear: 1950, description: 'Radioactive, used as a neutron source.' },
        { name: 'Einsteinium', symbol: 'Es', atomicNumber: 99, atomicMass: 252, category: 'Actinide', electronConfiguration: '[Rn] 5f¹¹ 7s²', meltingPoint: '860 °C', boilingPoint: 'unknown', density: '8.84 g/cm³', discoveredBy: 'Albert Ghiorso et al.', discoveryYear: 1952, description: 'Radioactive, transuranic element.' },
        { name: 'Fermium', symbol: 'Fm', atomicNumber: 100, atomicMass: 257, category: 'Actinide', electronConfiguration: '[Rn] 5f¹² 7s²', meltingPoint: '1527 °C', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Albert Ghiorso et al.', discoveryYear: 1952, description: 'Radioactive, transuranic element.' },
        { name: 'Mendelevium', symbol: 'Md', atomicNumber: 101, atomicMass: 258, category: 'Actinide', electronConfiguration: '[Rn] 5f¹³ 7s²', meltingPoint: '827 °C', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Albert Ghiorso, Glenn T. Seaborg, Gregory R. Choppin, Bernard G. Harvey, Stanley G. Thompson', discoveryYear: 1955, description: 'Radioactive, transuranic element.' },
        { name: 'Nobelium', symbol: 'No', atomicNumber: 102, atomicMass: 259, category: 'Actinide', electronConfiguration: '[Rn] 5f¹⁴ 7s²', meltingPoint: '827 °C', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Joint Institute for Nuclear Research / Lawrence Berkeley National Laboratory', discoveryYear: 1966, description: 'Radioactive, transuranic element.' },
        { name: 'Lawrencium', symbol: 'Lr', atomicNumber: 103, atomicMass: 262, category: 'Actinide', electronConfiguration: '[Rn] 5f¹⁴ 7s² 7p¹', meltingPoint: '1627 °C', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Albert Ghiorso, Torbjørn Sikkeland, Almon Larsh, Robert M. Latimer', discoveryYear: 1961, description: 'Radioactive, transuranic element.' }
    ];

    const categoryColors = {
        'Alkali Metal': '#ff9999',
        'Alkaline Earth Metal': '#ffcc99',
        'Lanthanide': '#ffc0cb',
        'Actinide': '#ffb3e6',
        'Transition Metal': '#99ccff',
        'Post-Transition Metal': '#99ffcc',
        'Metalloid': '#ffff99',
        'Nonmetal': '#c2f0c2',
        'Non-metal': '#c2f0c2',
        'Halogen': '#b3e6b3',
        'Noble Gas': '#c2c2f0',
        'empty': 'transparent',
        'Unknown': '#e0e0e0'
    };

    function renderPeriodicTable() {
        periodicTableGrid.innerHTML = '';

        // This is a simplified rendering for demonstration.
        // For a full table, you should use a 2D array or mapping for positions.
        let col = 1;
        elementsData.forEach(element => {
            const cellDiv = document.createElement('div');
            if (element.category === 'empty') {
                cellDiv.classList.add('empty-cell');
                if (element.gridColumn) cellDiv.style.gridColumn = element.gridColumn;
            } else {
                // Use both 'Nonmetal' and 'Non-metal' for compatibility
                let catClass = element.category.toLowerCase().replace(/\s/g, '-');
                cellDiv.classList.add('element-cell', `category-${catClass}`);
                cellDiv.innerHTML = `
                    <span class="atomic-number">${element.atomicNumber}</span>
                    <span class="symbol">${element.symbol}</span>
                    <span class="name">${element.name}</span>
                `;
                cellDiv.dataset.elementData = JSON.stringify(element);
                cellDiv.addEventListener('click', showElementDetail);
                if (element.gridColumn) cellDiv.style.gridColumn = element.gridColumn;
                if (element.gridRow) cellDiv.style.gridRow = element.gridRow;
            }
            periodicTableGrid.appendChild(cellDiv);
            col++;
        });
    }

    function renderCategoryLegend() {
        legendContainer.innerHTML = '';

        const categories = [...new Set(elementsData.map(el => el.category))]
            .filter(cat => cat && cat !== 'empty')
            .sort();

        // Ensure Lanthanide and Actinide are first
        ['Lanthanide', 'Actinide'].forEach(cat => {
            const idx = categories.indexOf(cat);
            if (idx > -1) {
                categories.splice(idx, 1);
                categories.unshift(cat);
            }
        });

        categories.forEach(category => {
            const legendItem = document.createElement('div');
            legendItem.classList.add('legend-item');

            const colorBox = document.createElement('div');
            colorBox.classList.add('legend-color-box');
            colorBox.style.backgroundColor = categoryColors[category] || '#e0e0e0';

            const categoryName = document.createElement('span');
            categoryName.textContent = category;

            legendItem.appendChild(colorBox);
            legendItem.appendChild(categoryName);
            legendContainer.appendChild(legendItem);
        });
    }

    function showElementDetail(e) {
        const elementData = JSON.parse(e.currentTarget.dataset.elementData);

        modalElementName.textContent = elementData.name;
        modalElementSymbol.textContent = elementData.symbol;
        modalElementAtomicNumber.textContent = elementData.atomicNumber;
        modalElementAtomicMass.textContent = elementData.atomicMass;
        modalElementCategory.textContent = elementData.category;
        modalElementElectronConfiguration.textContent = elementData.electronConfiguration || 'N/A';
        modalElementMeltingPoint.textContent = elementData.meltingPoint || 'N/A';
        modalElementBoilingPoint.textContent = elementData.boilingPoint || 'N/A';
        modalElementDensity.textContent = elementData.density || 'N/A';
        modalElementDiscoveredBy.textContent = elementData.discoveredBy || 'N/A';
        modalElementDiscoveryYear.textContent = elementData.discoveryYear || 'N/A';
        modalElementDescription.textContent = elementData.description || 'N/A';

        modalElementName.style.color = categoryColors[elementData.category] || '#007bff';

        elementDetailModal.style.display = 'flex';
    }
    function hideElementDetail() {
        elementDetailModal.style.display = 'none';
    }
    if (closeModalButton) {
        closeModalButton.addEventListener('click', hideElementDetail);
    }

    elementDetailModal.addEventListener('click', (e) => {
        if (e.target === elementDetailModal) {
            hideElementDetail();
        }
    });

    renderPeriodicTable();
    renderCategoryLegend();
});
/* incomplete code, not fully translated and accounted for */