import axios from "axios"

class CommonRepository {
  async uploadImage(data: FormData) {
    try {
      const response = await axios.request({
        method: 'POST',
        data: data,
        url: 'https://zchat-staging.f99.link/api/advertise/attachments'
      })
      return response.data
    }
    catch(error) {
      console.log(error)
    }
  }
}

export default new CommonRepository()