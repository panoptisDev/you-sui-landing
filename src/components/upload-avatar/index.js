/* eslint-disable jsx-a11y/alt-text */
import { Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { isEmpty } from 'lodash';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadAvatar } from 'services/auth';
const baseStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderRadius: '50%',
    backgroundColor: 'transparent',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    width: 270,
    height: 270,
    // marginRight: 24,
    cursor: 'pointer',
    justifyContent: 'center',
};

const focusedStyle = {
    borderColor: '#29b6f6',
};

const acceptStyle = {
    borderColor: '#66bb6a',
};

const rejectStyle = {
    borderColor: '#f44336',
};

const StyledAvatarBox = styled('div')(({ theme }) => ({
    width: 128,
    height: 128,
}));

const StyledAvatar = styled('img')(({ theme }) => ({
    width: '100%',
    borderRadius: '50%',
    objectFit: 'contain',
}));

export const UploadAvatar = ({ avatarUrl, id }) => {
    const [urlImageUser, setUrlImageUser] = React.useState('');

    const { mutateAsync: uploadAvatar, isLoading } = useUploadAvatar({
        onSuccess: (args) => {
            // Update info avt in here
            setUrlImageUser(args.avatar);
        },
    });

    const [files, setFiles] = React.useState([]);

    React.useEffect(() => {
        if (avatarUrl) setFiles([{ avatar: avatarUrl }]);
    }, [avatarUrl]);

    React.useEffect(
        () => () => {
            files.forEach((file) => URL.revokeObjectURL(file.upload));
        },
        [files]
    );

    const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles) => {
            setFiles(
                acceptedFiles?.map((file) =>
                    Object.assign(file, {
                        upload: URL.createObjectURL(file),
                    })
                )
            );
            const acceptFile = acceptedFiles[0];
            const form = new FormData();
            form.append('upload', acceptFile);
            uploadAvatar({ form, id });
        },
    });

    const style = React.useMemo(
        () => ({
            ...baseStyle,
            ...(isFocused ? focusedStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isFocused, isDragAccept, isDragReject]
    );

    const thumbs = files.map((file) => (
        <StyledAvatarBox key={file?.upload}>
            <StyledAvatar src={!isEmpty(avatarUrl) ? avatarUrl : urlImageUser} alt={file.path} />
        </StyledAvatarBox>
    ));

    const renderPreview = () => {
        return (
            <>
                {isLoading ? (
                    <div {...getRootProps({ style })}>
                        <CircularProgress size={32} color="primary" />
                    </div>
                ) : (
                    <aside>
                        <input {...getInputProps()} />
                        {thumbs}
                    </aside>
                )}
            </>
        );
    };

    const renderUploadArea = React.useCallback(() => {
        return (
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                {avatarUrl ? (
                    <img src={avatarUrl} style={{ borderRadius: '50%', width: 270, height: 270 }} />
                ) : (
                    <img src={avatarUrl} style={{ borderRadius: '50%', width: 270, height: 270 }} />
                )}
            </div>
        );
    }, [getInputProps, getRootProps, style]);

    return (
        <Box sx={{ display: 'flex', backgroundColor: 'transparent' }}>
            {files.length > 0 ? renderPreview() : renderUploadArea()}
        </Box>
    );
};
