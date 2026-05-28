const image = (logoData) => {
console.log(logoData)

    if (!logoData) {
        return 'https://via.placeholder.com/150?text=No+Image'; 
    }

    if (typeof logoData === 'string' && logoData.startsWith('http')) {
        return logoData;
    }
    
    if (typeof logoData === 'string' && logoData.startsWith('data:image')) {
        return logoData;
    }

    return logoData;
};

export default image;