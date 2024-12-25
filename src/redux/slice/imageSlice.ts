import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IImageUrl {
    imageUrl: string | null
}

const initialState: IImageUrl = {
    imageUrl: null
}

const imageUrlSlice = createSlice({
    name: 'imageUrl',
    initialState,
    reducers: {
        setImageUrl: (state, action: PayloadAction<string | null>) => {
            state.imageUrl = action.payload
        },
    }
})

export const { setImageUrl } = imageUrlSlice.actions

export default imageUrlSlice.reducer;