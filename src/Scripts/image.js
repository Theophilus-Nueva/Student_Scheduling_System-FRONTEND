const image = (logoData) => {
    const byteNumbers = logoData.data || logoData;

    if (Array.isArray(byteNumbers)) {
        let binary = '';
        const bytes = new Uint8Array(byteNumbers);
        const len = bytes.byteLength;
        
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        
        const base64String = window.btoa(binary);
        return `data:image/jpeg;base64,${base64String}`;
    }
    
    return `data:image/jpeg;base64,${logoData}`;
  };

export default image