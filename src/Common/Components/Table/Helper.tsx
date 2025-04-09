// Helper.tsx

export const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'paid':
            return 'status-tag status-success';
        case 'pending':
            return 'status-tag status-warning';
        case 'failed':
            return 'status-tag status-danger';
        case 'fulfilled':
            return 'status-tag status-success';
        case 'processing':
            return 'status-tag status-info';
        case 'in progress':
            return 'status-tag status-in progress';
        case 'cancelled':
            return 'status-tag status-danger';
        default:
            return 'status-tag';
    }
};

export const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'paid':
            return 'bi bi-square-fill';
        case 'pending':
            return 'bi bi-clock-fill';
        case 'failed':
            return 'bi bi-x-circle-fill';
        case 'fulfilled':
            return 'bi bi-box-seam-fill';
        case 'in progress':
            return 'bi bi-slash-square';
        case 'processing':
            return 'bi bi-arrow-repeat';
        case 'cancelled':
            return 'bi bi-slash-circle-fill';
        default:
            return '';
    }
};

export const renderCell = (column: any, value: any) => {
    if (column.type === 'status') {
        return (
            <span className={getStatusClass(value)}>
                <i className={getStatusIcon(value)}></i>
                <span className="status-text">{value}</span>
            </span>
        );
    }
    return value;
};

export const renderIcons = (iconProp: string | string[] | undefined) => {
    if (!iconProp) return null;
    
    if (Array.isArray(iconProp)) {
        return iconProp.map((icon, iconIndex) => (
            <i key={iconIndex} className={icon}></i>
        ));
    }
    return <i className={iconProp}></i>;
};
